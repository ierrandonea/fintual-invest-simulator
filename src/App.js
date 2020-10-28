import React, { useContext, useEffect, useState } from 'react';
import injectContext, { Context } from './store/appContext';
import logo from './static/logo.svg';
import * as moment from 'moment'

function App() {
  const { store, actions } = useContext(Context);
  const [state, setState] = useState({
    funds: false,
    error: false
  });

  let date = new Date()
  const maxDate = moment(date).format('YYYY-MM-DD')

  let finalAmount = Math.trunc(store.norrisFinal + store.pittFinal + store.clooneyFinal)
  let revenue = finalAmount - parseInt(store.amount)

  return (
    <>
      <header>
        <img src={logo} alt="fintual logo" className="logo mx-3 mt-3" />
      </header>
      <div className="container p-5">

        {/* Simulator */}

        <div className="row d-flex justify-content-center no-gutters">
          <div className="col-11 col-md-10 col-lg-9 border-0 shadow rounded-lg">
            <div className="card-header bg-white rounded-lg border-0 p-3">
              <h3>Simulador de Inversiones "what if" 💸</h3>
            </div>
            <form id="simulator">
              <div className="card-body bg-white">
                <div className="form-group form-row">
                  <label for="amount">Ingresa el monto invertido</label>
                  <input type="number" className="form-control" id="amount" name="amount" type="number" step="1" pattern="\d+" onChange={e => { actions.setAmount(e); setState({ ...state, amount: true }) }} />
                </div>
                <div className="form-row">
                  {
                    store.amountError == true &&
                    <div className="alert alert-danger col-12 px-3 my-3" role="alert">
                      Por favor ingresa un número mayor a 0
                    </div>
                  }
                </div>
                <div className="form-group form-row">
                  <label for="dateStart">Ingresa la fecha de inversión</label>
                  <input type="date" className="form-control" readOnly={store.amountPass == false ? true : false} id="dateStart" name="dateStart" min="2018-02-12" max={maxDate} onChange={e => { actions.setDate(e); setState({ ...state, date: true }) }} />
                </div>
                <div className="form-row">
                  {
                    store.dateError == true &&
                    <div className="alert alert-danger col-12 px-3 my-3" role="alert">
                      Por favor elige una fecha pasada
                    </div>
                  }
                </div>
                <p className="font-weight-bold mt-4">Elige cómo habrías distribuido tus fondos (en XX%):</p>
                <div className="form-row">
                  <div className="col-12 col-md-4">
                    <label for="risky_norris">Riesgoso</label>
                    <input type="number" className="form-control" id="risky_norris" name="risky_norris" readOnly={store.date == false ? true : false} onChange={e => actions.setValues(e)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label for="moderate_pitt">Moderado</label>
                    <input type="number" className="form-control" id="moderate_pitt" name="moderate_pitt" readOnly={store.date == false ? true : false} onChange={e => actions.setValues(e)} />
                  </div>
                  <div className="col-12 col-md-4">
                    <label for="conservative_clooney">Conservador</label>
                    <input type="number" className="form-control" id="conservative_clooney" name="conservative_clooney" readOnly={store.date == false ? true : false} onChange={e => actions.setValues(e)} />
                  </div>
                </div>
                <div className="form-row">
                  {
                    store.error == true &&
                    <div className="alert alert-danger col-12 px-3 my-3" role="alert">
                      El total no puede superar <strong> 100%</strong>
                    </div>
                  }
                </div>
                {
                  !!store.finalAmount &&
                  (<div className="form-row d-flex justify-content-between py-3">
                    <div className="col-12 col-md-6 mt-4 card rounded-lg py-3 shadow-sm">
                      <div className="ml-3 pl-3 border-left">
                        <h5>Tu saldo hoy sería:</h5>
                        <h3>${finalAmount}</h3>
                      </div>
                    </div>
                    <div className="col-12 col-md-5 mt-4 card rounded-lg py-3 shadow-sm">
                      <div className="ml-3 pl-3 border-left">
                        <h5>Tu ganacia:</h5>
                        <h3>${revenue}</h3>
                      </div>
                    </div>
                  </div>)
                }
              </div>
              <div className="card-footer text-right bg-white rounded-lg border-0 p-3">
                {
                  !!store.finalAmount ?
                    <button type="reset" className="btn btn-outline-dark rounded-lg " onClick={() => actions.resetStore()}>Volver a simular</button>
                    :
                    <button className={"btn rounded-lg " + (store.button == true ? " btn-primary disabled" : " btn-secondary text-secondary")} data-toggle="modal" data-target="#finalAmountModal" onClick={e => actions.getInvestment(e)}>Simular</button>
                }
              </div>
            </form>
          </div>
        </div>

        {/* Simulator */}

        {/* Instructions */}

        <div className="row d-flex justify-content-center py-5">
          <div className="col-12 col-md-11 col-lg-11 text-muted">
            <h4 className="text-secondary py-3">Instrucciones:</h4>
            <p className="text-sm font-weight-normal py-3 text-justify">Bienvenido al simulador de inversiones pasadas!
            <br /><br />
            Muchas veces nos preguntamos "¿Qué tal si hubiese hecho una inversión en algún momento?, ¿Cúanta plata podría haber ganado/perdido? 🤔
            <br /><br />

            Esta aplicación utiliza la información que brinda la API de Fintual y se encarga de responder esa hípotesis de inversiones que "podrían haber sido", los pasos para usarla son súper simples! 😁</p>
            <ol className="px-4">
              <li className="py-3">Ingresa un monto en pesos chilenos (ejemplo: 2000000 * sólo números enteros! sin puntos ni comas 🙃)</li>
              <li className="py-3">Ingresa una fecha (*desde 2018-02-12 hasta hoy. Lamentablemente, esta aplicación aún no puede predecir el futuro...)</li>
              <li className="py-3">Elige cómo hubieses distribuído tus fondos, desde el más riesgoso al más conservador, lo importante es que no te pases del 100%!</li>
              <li className="py-3">Presiona el botón de "Simular" y listo! Tendrás el resultado de tu inversión "what if". 😎</li>
              <li className="py-3">Si lo deseas puedes volver a simular con nuevos montos y fechas</li>
            </ol>
            <p className="font-weight-light py-3 text-justify">* si tienes algún problema mientras usas esta aplicación o quieres hacer una sugerencia o comentario, puedes escríbirme a ierrandoneag@gmail.com o contactarme por <a href="https://www.linkedin.com/in/ierrandonea/" target="_blank">linkedIn</a>.</p>
          </div>
        </div>
      </div>

      {/* Instructions */}

      <footer className="container-fluid bg-primary py-4">
        <div className="row text-white">
          <div className="col font-weight-lighter d-flex flex-column align-items-end">
            <a href="https://github.com/ierrandonea/fintual-invest-simulator" className="py-2 white-link" target="_blank"><span>Repositorio de este proyecto (GitHub)</span></a>
            <a href="https://fintual.cl" className="py-2 white-link" target="_blank"><span>Link a la página de Fintual (De dónde se cunsume la API)</span></a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default injectContext(App);
