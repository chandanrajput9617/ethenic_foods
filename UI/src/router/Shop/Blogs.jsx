import React from 'react'
import { useLocation } from 'react-router-dom';
import { useProductState } from './context/ProductContext';
import Header from './Header';
import { Footer } from './Footer';
import "./style.css"

const Blogs = () => {
    const location = useLocation();
    const selectedBlog = location.state?.selectedBlog;
    const { createMarkup } = useProductState();

    return (
        <>
            <Header />
            <div className='container'>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '20px', margin:"10px"  }}>
                    <h1>
                        Blog Details
                    </h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: "100%", flexDirection: "column" , alignItems:'center' }}>
                    
                        <img className='blog-img' src={import.meta.env.VITE_APP_BASE_API + selectedBlog?.image
                        } alt="Blogimage" style={{ maxWidth: '100%', height: '500PX', width: "80%" }} />
                </div>
                <p style={{marginLeft:'110px',marginTop:"5px"}}>
                            {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                {/* <div style={{ display: 'flex',  width: '100%', paddingTop: '20px' }}>
                <p>
                    {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>
            </div> */}
                <div className=" m-5 justify-content-center" style={{
                    textAlign:"justify"
                }} dangerouslySetInnerHTML={createMarkup(selectedBlog?.content)}
                >
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Blogs