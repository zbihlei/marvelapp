import './charSearchForm.scss';
import { Link } from 'react-router-dom';
import {Formik,Form, Field, ErrorMessage} from 'formik';
import useMarvelService from '../../services/MarvelService';
import { useState } from 'react';
import * as Yup from 'yup';


const Messages = (props)=>{
    if (props.found) {
        return (
            <div> 
                <div className='character'><span>There is! visit {props.name} page?</span></div> 
                <Link to ={`/${props.name}`}>
                <button 
                    type="button"
                    className="button button__secondary topage">
                    <div className="inner">to page</div>
                </button> 
                </Link>
            </div> 
            )
    }  
    if (props.error){
        return (
        <div> 
        <div className='errorMessage'><span>The character was not found. Check the name and try again</span></div> 
        </div>
        ) 
    }
}

const CharSearchForm = ()=>{
    const [found, setFound] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const {getCharacterByName} = useMarvelService();


    return (
        <Formik 
        initialValues = {{
            charname: ''
        }}
        validationSchema = {
            Yup.object({
                charname: Yup.string().required('This is required string')
            })}
        onSubmit = {value =>  getCharacterByName(value.charname)
                                    .then(setFound(true))
                                    .then(setName(value.charname))
                                    .catch(() => setFound(false) , setError(true))}
        >

      <Form className="char__search-form">        
        <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
        <div className="char__search-wrapper">
            <Field 
                id="charName" 
                name='charname' 
                type='text' 
                placeholder="Enter name"/>    
            <button 
                type='submit' 
                className="button button__main">
                <div className="inner">find</div>
            </button>
        </div>
        <ErrorMessage className='errorMessage' name='charname' component="div"/>        
        <Messages name = {name} found={found} error = {error}/> 
      </Form>
    </Formik>
    )
    
    
}

export default CharSearchForm;