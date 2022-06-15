import React, {useState, useEffect, useContext} from 'react'
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/pizzaBlock/PizzaBlock';
import Skeleton from '../components/pizzaBlock/Skeleton';
import Pagination from '../components/pagination';
import { SearchContext } from '../App';

const Home = () => {
    const {searchValue} = useContext(SearchContext)
    const [pizzas, setPizzas] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [categoryId, setCategoryId] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortType, setSortType] = useState({
        name: 'популярности',
        sortProperty: 'rating'
    })
  
    useEffect(() => {
        setIsLoading(true)

        const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy = sortType.sortProperty.replace('-', '')
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''

        fetch(`https://6295c7a475c34f1f3b20fc53.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`)
            .then(res => res.json())
            .then(json => {
        setPizzas(json)
        setIsLoading(false)
      })
      window.scrollTo(0, 0)
    }, [categoryId, sortType, searchValue, currentPage])

    const pizzasItem = pizzas.map(obj =>  (<PizzaBlock key={obj.id} {...obj}/>))
    const skeletons = [...new Array(8)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={(i) => setCategoryId(i)}/>
                <Sort value={sortType} onChangeSort={(i) => setSortType(i)}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">            
                {isLoading ? skeletons : pizzasItem}
            </div>
            <Pagination onChangePage={(number) => setCurrentPage(number)}/>
        </div>
    )
}

export default Home