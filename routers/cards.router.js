import express from "express"
import {
  changeStatus,
  createCard,
  deleteCard,
  getAll,
} from "../controllers/cards.controller.js"

const cardsRouter = express.Router()

cardsRouter.get("/getAll", getAll)
cardsRouter.post("/create", createCard)
cardsRouter.put("/changeStatus/:id", changeStatus)
cardsRouter.delete("/delete/:id", deleteCard)

export default cardsRouter
