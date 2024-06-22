import pg from "pg";


const pool = new pg.Pool({
  user: "gen_user",
  password: "B.Aziev-03",
  host: "94.241.169.9",
  port: "5432",
  database: "Cards",
});

export default pool