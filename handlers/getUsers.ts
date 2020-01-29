import { getUsers } from "../services/users.ts";

export default async context => {
    const authorization = context.request.headers.get('authorization');

    const query = `query { 
      ventaGeneral(periodo: "202001" nivelInformacion:"dios" isoPais:"MX"){
      presupuesto_mensual
      venta_mensual
      venta_esperada_mensual
      venta_faltante_mensual
      deficit_superavit
      porcentaje_avance
      porcentaje_ideal
      periodo
      historico_mensual_venta {
        label
        value
      }
      historico_mensual_presupuestado {
        label
        value
      }
    }
  }`

 context.response.body = await fetch('http://10.1.8.31:8080/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query 
    })
  }
  ).then((data: Response) => {
          return data.text().then( texto => {
            const datos = texto && JSON.parse(texto);
            return datos;
          })
        })
};
