import './singleComicPage.scss';
import {useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import AppBanner from "../appBanner/AppBanner";
import setContent from '../../utils/setContent';


const SingleCharPage = ()=>{

    const {character} = useParams();
    const [char, setChar] = useState(null);
    const {getCharacterByName, clearError, process, setProcess} = useMarvelService();


    useEffect(()=>{
        updateChar();
    },[character])

    const updateChar =()=>{
        clearError();
        getCharacterByName(character)
                .then(onCharLoaded)
                .then(() =>setProcess('confirmed'));
    }

   const onCharLoaded = (char) =>{
        setChar(char);
    }

    return (
        <>
        <AppBanner/>
        {setContent(process, View, char)}
        </>
     )
  
}

const View = ({data}) =>{

    const {name, description,thumbnail} = data;

    return (
        <div className="single-comic">
        <img src={thumbnail} alt={name} className="single-comic__img"/>
        <div className="single-comic__info">
            <h2 className="single-comic__name">{name}</h2>
            <p className="single-comic__descr">{description}</p>
        </div>
    </div>
    )
}

export default SingleCharPage;