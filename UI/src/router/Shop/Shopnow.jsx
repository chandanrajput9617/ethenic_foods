import React from 'react'
import "./style.css"

export const Shopnow = (props) => {
  const sectionStyle = {
    backgroundImage: `url('https://www.ethnicfoods.com/api${props?.herosection?.image}')`,
  };
  const scrollToBestseller = () => {
    const bestsellerSection = document.getElementById('bestsellers');
    if (bestsellerSection) {
      bestsellerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  return (
<>
<section className="banner" id='Herosection' style={sectionStyle}>
        <div className="row pt-5">
            <div className="col-md-12 text-dark justify-content-center text-center mt-3">
                <h1 className="text-center text-dark text-lg mt-5 mb-3 " style={{fontSize:"42px", width:"406px", margin:"auto",lineHeight:"58px",textWrap:"balance"}}>{props?.herosection?.title}</h1>
                <h6>{props?.herosection?.subtitle}</h6>
                <div className="d-grid gap-2 align-items-center">
                <button id="Shopbtn" className="btn btn-success ms-auto" onClick={scrollToBestseller}>Shop Now</button>
                </div>
            </div>
        </div>
    </section>
</>
  )
}
