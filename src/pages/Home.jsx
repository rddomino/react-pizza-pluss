import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/pizzaBlock/PizzaBlock';
import Skeleton from '../components/pizzaBlock/Skeleton';
import Pagination from '../components/pagination';
import { SearchContext } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slice/filterSlice';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import { sortList } from '../components/Sort';
import { useRef } from 'react';

const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isSearch = useRef(false)
    const isMounted = useRef(false)

    const {categoryId, sort, currentPage} = useSelector(state => state.filter)      
    const {searchValue} = useContext(SearchContext)
    const [pizzas, setPizzas] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const fetchPizzas = () => {
        setIsLoading(true)
    
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const sortBy = sort.sortProperty.replace('-', '')
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''

        axios.get(`https://6295c7a475c34f1f3b20fc53.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=${order}${search}`)
            .then((res) => {
                setPizzas(res.data)
                setIsLoading(false)
            })

        window.scrollTo(0, 0)
    }

    // Если изменили параметры и был первый рендер
    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage
            })
    
            navigate(`?${queryString}`)
        }     
        isMounted.current = true   

    }, [categoryId, sort.sortProperty, currentPage])

    // Если был первый рендер, то проверяем URl-параметры и сохраняем в редаксе
    useEffect(() => {
        if (window.location.search &&
            window.location.search !== "?sortProperty=rating&categoryId=0&currentPage=1") {
            const params = qs.parse(window.location.search.substring(1))

            const sort = sortList.find(obj => obj.sortProperty === params.sortProperty)

            dispatch(setFilters({
                ...params,
                sort
            }))
            isSearch.current = true
        }
    }, [])    
  
    // Если был первый рендер, то запрашиваем пиццы
    useEffect(() => {
        window.scrollTo(0, 0)

        if (!isSearch.current) {
            fetchPizzas()
        }

        isSearch.current = false
        
    }, [categoryId, sort.sortProperty, searchValue, currentPage])

    const pizzasItem = pizzas.map(obj =>  (<PizzaBlock key={obj.id} {...obj}/>))
    const skeletons = [...new Array(8)].map((_, index) => <Skeleton key={index}/>)

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
                <Sort />
                {/* <Sort value={sortType} onChangeSort={(i) => setSortType(i)}/> */}
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">            
                {isLoading ? skeletons : pizzasItem}
            </div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    )
}

export default Home