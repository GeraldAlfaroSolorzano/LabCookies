export function calcularCobro(req,res){
    const {placa, tipo, horas, minutos} = req.body;
  
  if (!placa ||placa.trim()==""){
    res.status(400).json({error: 'La placa es requerida'});
  } 
  if (!tipo || (tipo!=="carro" && tipo!=="moto") ){
     res.status(400).json({error: 'El tipo de vehículo es requerido'});
  }
  if (Number.isNaN(horas) || horas < 0){
    res.status(400).json({error: 'La cantidad de horas ingresadas no es valida'});res.status(400).json({error: 'La cantidad de horas ingresadas no es valida'});
  } 
  if (Number.isNaN(minutos) || minutos < 0 || minutos > 59){
    res.status(400).json({error: 'La cantidad de minutos ingresados no es valida'});
  } 
  
  const tarifa=tipo==="carro"? 1200 : 500;

  let h=Number(horas);
  let m=Number(minutos);

  if (m>5) h++;

  const total=h*tarifa;

  res.json({
    placa:placa,
    tipo:tipo,
    tarifa:tarifa,
    tiempo: horas+":"+minutos,
    horasCobradas:h,
    total:total
  });
}