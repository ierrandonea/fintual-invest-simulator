import * as moment from 'moment'
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            error: false,
            amountError: false,
            dateError: false,
            //  the triggers for clearing inputs from readOnly
            button: false,
            amountPass: false,
            date: false,
            // the amount & start date to consult
            amount: null,
            dateStart: null,
            // the % of investment in each fund
            risky_norris: "0",
            moderate_pitt: "0",
            conservative_clooney: "0",
            // the data from each fund from the API
            dataClooney: null,
            dataPitt: null,
            dataNorris: null,
            // the final amount of investment & revenue
            norrisFinal: null,
            pittFinal: null,
            clooneyFinal: null,
            finalAmount: null,
            revenue: null
        },
        actions: {
            // sets initial amount to invest, validates for negative numbers & triggers an error if so
            setAmount: e => {
                if (Math.sign(parseInt(e.target.value)) == -1) {
                    setStore({
                        amountError: true
                    })
                } else {
                    setStore({
                        amountError: false,
                        amountPass: false
                    })
                    if (e.target.value === "") {
                        setStore({
                            amountPass: false,
                            [e.target.name]: "0"
                        })
                    } else {
                        setStore({
                            amountPass: true,
                            [e.target.name]: e.target.value
                        })
                    }
                }
            },
            // set past date, validates for NOT future dates & triggers alert
            setDate: e => {
                let date = new Date()
                const inputDate = moment(e.target.value, 'YYYY-MM-DD')
                const maxDate = moment(date, 'YYYY-MM-DD')                
                const minDate = moment(date, 'YYYY-MM-DD')
                if (inputDate > maxDate) {
                    setStore({
                        dateError: true,
                        date: false,                                                
                        [e.target.name]: null
                    })
                } else if (inputDate < maxDate) {
                    setStore({
                        dateError: false,  
                        date: true,                      
                        [e.target.name]: e.target.value
                    })
                } else if (!!e.target.value) {
                    setStore({
                        dateError: true,
                        date: false
                    })
                }
            },
            // validates for the sum of all individual percentages, to check if not more than 100%
            validatePercent: () => {
                let store = getStore();
                let hundred = parseInt(store.conservative_clooney) + parseInt(store.moderate_pitt) + parseInt(store.risky_norris)
                if (hundred > 100) {
                    setStore({
                        error: true
                    })
                } else {
                    setStore({
                        error: false
                    })
                }

                if (hundred == 100) {
                    setStore({
                        button: true
                    })
                } else {
                    setStore({
                        button: false
                    })
                }
            },
            // sets each investment fund value on store and validates for each to not be > 100%
            setValues: e => {
                let aux = parseInt(e.target.value)
                if (aux > 100 || aux < 0) {
                    setStore({
                        error: true
                    })
                } else {
                    setStore({
                        error: false
                    })
                }
                if (e.target.value === "") {
                    setStore({
                        [e.target.name]: "0"
                    })
                } else {
                    setStore({
                        [e.target.name]: e.target.value
                    })
                }
                let store = getStore();
                let hundred = parseInt(store.conservative_clooney) + parseInt(store.moderate_pitt) + parseInt(store.risky_norris)
                if (hundred > 100) {
                    setStore({
                        error: true
                    })
                } else {
                    setStore({
                        error: false
                    })
                }

                if (hundred == 100) {
                    setStore({
                        button: true
                    })
                } else {
                    setStore({
                        button: false
                    })
                }
            },
            // gets data from the API
            getClooney: maxDate => {
                let store = getStore();
                fetch(`https://fintual.cl/api/real_assets/188/days?to_date=${maxDate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setStore({
                            dataClooney: data
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getPit: maxDate => {
                let store = getStore();
                fetch(`https://fintual.cl/api/real_assets/187/days?to_date=${maxDate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setStore({
                            dataPitt: data
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            getNorris: maxDate => {
                let store = getStore();
                fetch(`https://fintual.cl/api/real_assets/186/days?to_date=${maxDate}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setStore({
                            dataNorris: data
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },
            // calculates the final amount
            getInvestment: e => {
                e.preventDefault();
                let store = getStore();
                // sets the initial price for ecah fund based on the given date
                let initialClooneyPrice = store.dataClooney.data.filter(cuota => cuota.attributes.date === store.dateStart);
                let initialPittPrice = store.dataPitt.data.filter(cuota => cuota.attributes.date === store.dateStart);
                let initialNorrisPrice = store.dataNorris.data.filter(cuota => cuota.attributes.date === store.dateStart);
                console.log(initialNorrisPrice)
                // sets a value on money for each fund depending on % defined by user
                let norrisAmount = parseInt(store.amount) * (!!parseInt(store.risky_norris) ? parseInt(store.risky_norris) / 100 : 0);
                let pittAmount = parseInt(store.amount) * (!!parseInt(store.moderate_pitt) ? parseInt(store.moderate_pitt) / 100 : 0);
                let clooneyAmount = parseInt(store.amount) * (!!parseInt(store.conservative_clooney) ? parseInt(store.conservative_clooney) / 100 : 0);
                // converts to shares
                let initalDateNorris = norrisAmount / parseInt(initialNorrisPrice[0].attributes.price)
                let initalDatePitt = pittAmount / parseInt(initialPittPrice[0].attributes.price)
                let initalDateClooney = clooneyAmount / parseInt(initialClooneyPrice[0].attributes.price)
                // gets final insvestment balance for each fund
                let norrisFinal = initalDateNorris * parseInt(store.dataNorris.data[0].attributes.price)
                let pittFinal = initalDatePitt * parseInt(store.dataPitt.data[0].attributes.price)
                let clooneyFinal = initalDateClooney * parseInt(store.dataClooney.data[0].attributes.price)
                setStore({
                    norrisFinal: norrisFinal,
                    pittFinal: pittFinal,
                    clooneyFinal: clooneyFinal,
                    finalAmount: norrisFinal + pittFinal + clooneyFinal,
                })
            },
            // just what it says it does...
            resetStore: () => {
                setStore({
                    amount: null,
                    dateStart: null,
                    risky_norris: null,
                    moderate_pitt: null,
                    conservative_clooney: null,
                    norrisFinal: null,
                    pittFinal: null,
                    clooneyFinal: null,
                    finalAmount: null
                })
            }

        }
    }
}


export default getState;