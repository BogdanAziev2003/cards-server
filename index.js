import express from "express"
import cors from "cors"
import cardsRouter from "./routers/cards.router.js"

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: "*", // Разрешить запросы от любого источника
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)

app.listen(5000, () => {
  console.log(`Server is running on port 5000`)
})

app.use("/cards", cardsRouter)