import express, { type Express, type Request, type Response } from 'express'
import * as v from './validation'
import { model } from './model'
import type { Game, Move } from './model'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import cors from 'cors'
import * as z from 'zod'

function startServer() {
  const games: Game[] = []
  const ongoing_games: Record<number, boolean> = {}

  const MessageType = z.enum(['new_game', 'game_starting', 'game_updated', 'move'])

  type MessageType = z.infer<typeof MessageType>

  type Subscriber = {
    id: string
    gameNumber?: number
    messageType: MessageType
    response: Response
  }

  type SubscriptionService = {
    subscribe(res: Response, messageType: MessageType, gameNumber?: number): Subscriber
    send(messageType: MessageType, message: {}, gameNumber: number): void
    unsubscribe(id: string): void
  }

  const subscriptionService = (): SubscriptionService => {
    let subscribers: Subscriber[] = []
    
    function subscribe(response: Response, messageType: MessageType, gameNumber?: number) {
      const subscriber = {
        id: crypto.randomUUID(),
        gameNumber,
        messageType,
        response
      }
      subscribers.push(subscriber)  
      return subscriber
    }

    function send(messageType: MessageType, message: {}, gameNumber: number) {
      subscribers
        .filter(s => (s.gameNumber === undefined || s.gameNumber === gameNumber) && s.messageType === messageType)
        .forEach(s => s.response.write(`data: ${JSON.stringify(message)}\n\n`))
    }

    function unsubscribe(id: string) {
      const index = subscribers.findIndex(s => s.id === id)
      if (index !== -1) subscribers.splice(index, 1)
    }
  
    return {subscribe, send, unsubscribe}
  }

  const create_game = (gameNumber: number, gameName: string) => {
    games.push(model(gameNumber, gameName))
    return games[games.length - 1]
  }

  const send_data = (res: Response, data: unknown) => {
    if (data) {
      res.send(data)
    } else {
      res.status(404).send()
    }
  }

    const send_game_data = (res: Response, gameNumber:number, extractor: (g:Game) => unknown) => {
        const game = games[gameNumber]
        send_data(res, game && extractor(game))
    }

    const subscriptions = subscriptionService()

    const gameserver: Express = express()

    gameserver.use(cors({
      origin: /:\/\/localhost:/,
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
    }))

    gameserver.use(bodyParser.json())

    const ExtendedGameData = z.intersection(v.GameData, z.object({ongoing: z.boolean()}))
    const PartialExtendedGameData = z.intersection(v.GameData.partial(), z.object({ongoing: z.boolean().optional()}))

    type ExtendedGameData = z.infer<typeof ExtendedGameData>

    interface TypedRequest<BodyType> extends Request {
        body: BodyType
    }

    gameserver.post('/games', async (req: TypedRequest<{gameName?: string}>, res: Response<ExtendedGameData>) => {
        const gameNumber = games.length
        const gameName = req.body.gameName ?? 'Game number ' + gameNumber
        const game = create_game(gameNumber, gameName)
        const data = { ...game.data(), ongoing: false }
        subscriptions.send('new_game', data, gameNumber)
        res.send(data)
    })

    gameserver.get('/games', (_, res) => {
        res.send(games
            .filter(g => !ongoing_games[g.gameNumber])
            .map(g => ({...g.data(), ongoing: false})))
    })

    gameserver.get('/games/events', (req, res) => {
      const messageTypeResult = MessageType.safeParse(req.query.type)
      if (!messageTypeResult.success) {
        res.status(400).send(z.prettifyError(messageTypeResult.error))
        return
      }

      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')

      const sub = subscriptions.subscribe(res, messageTypeResult.data)

      req.on('close', () => {
        subscriptions.unsubscribe(sub.id)
      })
    })

    gameserver.get('/games/:gameNumber/events', (req, res) => {
      const gameNumberResult = z.coerce.number().safeParse(req.params.gameNumber)
      if (!gameNumberResult.success) {
        res.status(400).send(z.prettifyError(gameNumberResult.error))
        return
      }
      const messageTypeResult = MessageType.safeParse(req.query.type)
      if (!messageTypeResult.success) {
        res.status(400).send(z.prettifyError(messageTypeResult.error))
        return
      }

      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')

      const sub = subscriptions.subscribe(res, messageTypeResult.data, gameNumberResult.data)
      req.on('close', () => {
        subscriptions.unsubscribe(sub.id)
      })
    })
    
    gameserver.get('/games/:gameNumber', (req: Request, res: Response) => {
      const gameNumberResult = z.coerce.number().safeParse(req.params.gameNumber)
      if (!gameNumberResult.success) {
        res.status(400).send(z.prettifyError(gameNumberResult.error))
        return
      }
      const gameNumber = gameNumberResult.data

      const ongoing = !!ongoing_games[gameNumber]
      send_game_data(res, gameNumber, g => ({...g.data(), ongoing}))
    })

    gameserver.patch('/games/:gameNumber', (req: TypedRequest<Partial<ExtendedGameData>>, res) => {
      const gameNumberResult = z.coerce.number().safeParse(req.params.gameNumber)
      if (!gameNumberResult.success) {
        res.status(400).send(z.prettifyError(gameNumberResult.error))
        return
      }
      const gameNumber = gameNumberResult.data
      const gameDataResult = PartialExtendedGameData.safeParse(req.body)
      if (!gameDataResult.success) {
        res.status(400).send(z.prettifyError(gameDataResult.error))
        return
      }

      const gameData = gameDataResult.data

      if (!games[gameNumber])
        res.status(404).send()
      else if (gameData.ongoing !== undefined) {
        // Attempting to start a game
        if (!gameData.ongoing || ongoing_games[gameNumber])
          res.status(403).send()
        else {
          ongoing_games[gameNumber] = true
          const data = { ...games[gameNumber], ongoing: true }
          res.send(data)
          subscriptions.send('game_starting', data, gameNumber)
          subscriptions.send('game_updated', data, gameNumber)
        }
      }
    })

    gameserver.post('/games/:gameNumber/moves', (req: TypedRequest<Move>, res) => {
      const gameNumberResult = z.coerce.number().safeParse(req.params.gameNumber)
      if (!gameNumberResult.success) {
        res.status(400).send(z.prettifyError(gameNumberResult.error))
        return
      }
      const gameNumber = gameNumberResult.data

      const moveResult = v.Move.safeParse(req.body)
      if (!moveResult.success) {
        console.log(req.body)
        console.log(moveResult.error)
        res.status(400).send(z.prettifyError(moveResult.error))
        return
      }
      const move = moveResult.data

      if (move.conceded) {
        if (!ongoing_games[gameNumber])
          res.status(403).send()
        else {
          games[gameNumber] = games[gameNumber].conceded()
          const data = { ...games[gameNumber], ongoing: false }
          const player = move.player
          subscriptions.send('move', {type: 'conceded', move: {player}, ...data}, gameNumber)
          res.send(data)
        }
      } else {
        const { x, y, player } = move
        const game = games[gameNumber]
        if (!ongoing_games[gameNumber])
          res.sendStatus(404)
        else if (player === game.inTurn && game.legalMove(x,y)) {
          const afterMove = game.makeMove(x, y)
          games[gameNumber] = afterMove
          const {inTurn, winState, stalemate} = afterMove
          const data = { move: { x, y, player: game.inTurn }, inTurn, winState, stalemate }
          subscriptions.send('move', {type: 'move', ...data}, gameNumber)
          res.send(data)
        } else {
          res.sendStatus(403)
        }
      }
    })

    gameserver.get('/games/:gameNumber/moves', (req, res) => {
      const gameNumberResult = z.coerce.number().safeParse(req.params.gameNumber)
      if (!gameNumberResult.success) {
        res.status(400).send(z.prettifyError(gameNumberResult.error))
        return
      }
      const gameNumber = gameNumberResult.data

      send_game_data(res, gameNumber, g => ({ 
          moves: g.moves, 
          inTurn: g.inTurn,
          winState: g.winState,
          stalemate: g.stalemate
      }))
    })

    gameserver.listen(8080, () => console.log('Gameserver listening on 8080'))
}

startServer()
