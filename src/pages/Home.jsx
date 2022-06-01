import React, {useState, useEffect} from 'react'
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/pizzaBlock/PizzaBlock';
import Skeleton from '../components/pizzaBlock/Skeleton';

const Home = () => {
    const [pizzas, setPizzas] = useState([])
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      fetch('https://6295c7a475c34f1f3b20fc53.mockapi.io/items')
      .then(res => res.json())
      .then(json => {
        setPizzas(json)
        setIsLoading(false)
      })
    }, [])

    return (
        <>
            <div className="content__top">
                <Categories />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">            
                { isLoading 
                ? [...new Array(8)].map((_, index) => <Skeleton key={index}/>)
                : pizzas.map(obj =>  (<PizzaBlock key={obj.id} {...obj}/>))
                }
            </div>
        </>
    )
}

export default Home