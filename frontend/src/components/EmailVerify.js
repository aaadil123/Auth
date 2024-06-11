import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {toast} from 'react-hot-toast'
import axios from 'axios';

const EmailVerify = () => {
    const[validUrl, setValidUrl] = useState(false);
    const param = useParams();

    // useEffect(() => {
    //     const verifyEmailUrl = async () => {
    //         try {
    //             const url = `http://localhost:4000/user/${param.id}/verify/${param.token}`;
    //             const {data} = await axios.get(url);
    
    //             if(data.error){
    //                 toast.error(data.error)
    //                 }
    //             else{
    //                 setValidUrl(true);
    //                 toast.success(data.message)
    //             }
    //         } catch (err) {
    //             setValidUrl(false);
    //             console.log(err)
    //             toast.error("Invalid Link")
    //         }
    //     };
    //     verifyEmailUrl();
    // }, [param]);

    async function verifyEmailUrl(){
        try {
            const url = `http://localhost:4000/user/${param.id}/verify/${param.token}`;
            const {data} = await axios.get(url);

            if(data.error){
                toast.error(data.error)
                }
            else{
                setValidUrl(true);
                toast.success(data.message)
            }
        } catch (err) {
            setValidUrl(false);
            console.log(err)
            toast.error("Invalid Link")
        }
    }
    
    return(
        <div>
            {
                validUrl ?
                (
                    <div>
                        <h1>
                            Email verified successfully
                        </h1>
                        <Link to='/login'>
                            <button >Login</button>
                        </Link>
                    </div>
                ) :
                (
                    // <h1>404 Not Found</h1>
                    <button onClick={verifyEmailUrl}>Verify your Email</button>
                )
            }
        </div>
    )
}

export default EmailVerify;