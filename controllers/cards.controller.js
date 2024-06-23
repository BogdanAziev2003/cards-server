import pool from "../db.js"
import moment from "moment-timezone";
export const getAll = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cards ORDER BY id DESC");

    // Преобразуем временные метки для каждого результата
    const rows = result.rows.map(row => {
      if (row.buy_time) {  
        row.buy_time = moment
          .tz(row.buy_time, 'Europe/Moscow')
          .format('DD.MM.YYYY');
      }
      return row;
    });

    res.json(rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCard = async (req, res) => {
  const { number, owner, broughter, phone, info } = req.body
  let now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
  let [date, time] = now.split(", ");
  let [day, month, year] = date.split(".");
  let formattedDateTime = `${year}-${month}-${day} ${time}`;

  console.log(formattedDateTime);

  try {
    const result = await pool.query(
      `INSERT INTO cards (number, owner, broughter, phone, buy_time, status, info) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [number, owner, broughter, phone, formattedDateTime, "grev", info]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error executing query", err.stack)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Проверяем, что поле status присутствует в теле запроса
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE cards SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const changeInfo = async (req, res) => {
  const { id } = req.params;
  const { info } = req.body;

  if (!info) {
    return res.status(400).json({ error: 'Info is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE cards SET info = $1 WHERE id = $2 RETURNING *',
      [info, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM cards WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: 'Card deleted successfully', deletedCard: result.rows[0] });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};