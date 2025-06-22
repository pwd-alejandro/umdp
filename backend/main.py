# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import duckdb
import pandas as pd

app = FastAPI()

# Allow local frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV through DuckDB view (lazy or in-memory)
con = duckdb.connect(database='../backend/db/saber_pro.duckdb')
con.execute("""
            create table if not exists resultados_saber_pro as
            select *
            from read_csv_auto('C:/Users/alejo/umdp/data/saber_pro_20250612.csv');
            """)


@app.get("/years")
def get_years():
    df = con.execute('''select distinct test_year
                        from resultados_mini
                        order by test_year''').df()
    return df["test_year"].tolist()


@app.get("/average-by-year-and-departamento")
def average_by_departamento():
    query = f"""
            select test_year,
               case
                   when residence_depto_code = '0000'
                       then 'extranjero'
                   else lower(residence_depto_name)
                   end as residence_depto_name,
               avg(score_math) as avg_score
            from resultados_mini
            group by 1, 2
            order by test_year, residence_depto_name
;
    """
    df = con.execute(query).df()
    return df.to_dict(orient="records")
