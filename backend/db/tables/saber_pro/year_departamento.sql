select test_year,
       case
           when residence_depto_code = '0000'
               then 'extranjero'
           else lower(residence_depto_name)
           end as residence_depto_name,
       avg(score_math) as avg_score
from resultados_mini
group by 1, 2
ORDER BY test_year, residence_depto_name;


