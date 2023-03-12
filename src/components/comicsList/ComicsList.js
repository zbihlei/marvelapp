import './comicsList.scss';
// import uw from '../../resources/img/UW.png';
// import xMen from '../../resources/img/x-men.png';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import { Link } from 'react-router-dom'

const setContent = (process, Component, newItemLoading)=>{
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        
        case 'loading':
            return newItemLoading ? <Component/>: <Spinner/>;
        
        case 'confirmed':
            return <Component/>;
        
        case 'error':
            return <ErrorMessage/>;
        
        default:
            throw new Error('Unexpected process state');
    }  
}

const ComicsList = (props) => {

    const {getAllComics, process, setProcess} = useMarvelService();

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);
    
    useEffect(()=>{
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ?  setNewItemLoading (false): setNewItemLoading (true);
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'));

            
    }

    const onComicsLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended  = true;
        }

        setComicsList(comicsList =>[...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset +9);   
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="comics__item"
                    key={item.id}>
                    <Link to ={`/comics/${i}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price ? item.price : 'NOT AVAILABLE'}</div>
                    </Link>

                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }


        return (
            <div className="comics__list">

        {setContent(process, () => renderItems(comicsList), newItemLoading)}
                
                <button className="button button__main button__long"
                         disabled={newItemLoading}
                         style={{'display': comicsEnded ? 'none' : 'block'}}
                         onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
       
    } 


export default ComicsList;