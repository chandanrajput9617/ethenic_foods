import React, { useState } from 'react'
import img1 from "./images/image 5.png"
import img2 from "./images/image 5 (2).png"
import flag from "./images/USA_Flag_icon.png"
import "./CheckProductCartResponsiveness.css"

const CheckProductCartResponsiveness = () => {
  let array = [{
    id: "658be609842a116bb62a7d4a",
    title: "Test00; kjlijoljk hjkhjkjh khjkhjk hjkhkjhkhj k1",
    short_description: "this is short huklknlkkjnkjk hkjkjhkjhk hkhkhjk hkhjkhj khjkhj khjkhjkhjihuiuh ijkjkijj  jhkjhlkj kjhkljlkhjk khlkjhlkhj lkhjkljhkh hlkjklhj hlkkhj kjhlkjlkh joklhilh hihihu ohihhi  description ",
    description: "this is description erferv   rf r gvhghh jhgjhjkh gjhkjh gjhgjh gjghhkjh v erv rf ergf rgf ",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }, {
    id: "658be609842a116bb62a7d4a",
    title: "Test00 edfc pjklj jiljkljl jljljkl kljkljk  erf vr 1",
    short_description: "this is sho revf erv vrt descriptio frferf vefverf erger gfefrve efv erfv erferf ergverv erverv ervferv erfverfv efverv erverv ervervn",
    description: "this is descripti ref erf ervf erv on",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }, {
    id: "658be609842a116bb62a7d4a",
    title: "Test001",
    short_description: "this is shor er t description",
    description: "this is description erf erfv erv efrv erv efv  erf erv ",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }, {
    id: "658be609842a116bb62a7d4a",
    title: "Test edfc ",
    short_description: "this is short description",
    description: "this is description",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }, {
    id: "658be609842a116bb62a7d4a",
    title: "Test001",
    short_description: "this is short description",
    description: "this is description",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }, {
    id: "658be609842a116bb62a7d4a",
    title: "Test001",
    short_description: "this is short description",
    description: "this is description",
    origin_country: "65813d8cb7ac04f7217dcc7d",
    images: [
      { img1 }, { img2 }]
  }]

  const [openmenu, setOpenMenu] = useState(false)
  return (
    <>
      <div className='hambagarmenu' onClick={!setOpenMenu}>
        <i className="fa-solid fa-bars"></i>
      </div>
      <div className='container'>
        <section id="search" className="mt-5">
          <div className="col-md-12 pr-0 pl-0 mb-5" >
            <form id="out" className="navbar-form navbar-left" action="/action_page.php">
              <div className="input-group border rounded-pill">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
                <div className="input-group-btn">
                  <button className="btn btn border rounded-end " type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="row">

            <div id="checkboxfilter" className="col-md-2 align-items-centerss ">
              <h5>Origin County</h5>
              <h6>All</h6>
              <div className="mb-3 mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="usaCheckbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">USA</label>
              </div>
              <div className="mb-3 mt-3 form-check">
                <input type="checkbox"
                  className="form-check-input"
                  id="usaCheckbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">India</label>
              </div>
              <div className="mb-3 mt-3 form-check">
                <input type="checkbox"
                  className="form-check-input"
                  id="usaCheckbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">France</label>
              </div>
              <div className="mb-3  mt-3 form-check">
                <input type="checkbox"
                  className="form-check-input"
                  id="usaCheckbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">Ukraine</label>
              </div>

              <h5 className="mt-4">Price</h5>
              <div className="mb-3  mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="range1Checkbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">1-20$</label>
              </div>
              <div className="mb-3  mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="range1Checkbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">20-50$</label>
              </div>
              <div className="mb-3  mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="range1Checkbox"
                  checked={('50-70$')}
                  onChange={() => ('50-70$')}
                />
                <label className="form-check-label" htmlFor="exampleCheck1">50-70$</label>
              </div>
              <div className="mb-3  mt-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="range1Checkbox"
                />
                <label className="form-check-label" htmlFor="exampleCheck1">+70$</label>
              </div>
            </div>
            <div className="col-md-10" >
              <div className="row">
                {array.map((product, index) => (
                  <div key={index} className="col-md-3 col-sm-6 col-md-4 col-lg-3 mb-4 border border-success">
                    <div>
                      <img src={img1} className="text-center m-2" style={{ maxWidth: '100%' }} alt="#" />
                    </div>
                    <div className="product-info ">
                      <div>
                        <h3 className="product-title" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' , fontSize: '20px', marginTop: '13px' }}><strong>{product.title}</strong></h3>
                      </div>
                      <div>
                        <p className="product-description" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.short_description}
                        </p>
                      </div>
                      <div>
                        <h5>Origin County: <img src={flag} alt="#" /></h5>
                      </div>
                    </div>
                    <div className="product-actions">
                      <a href="" className="mr-3"><img src="images/360.png" /></a>
                      <a href="" className="mr-3"><img src="images/Vector.png" /></a>
                      <a href=""><img src="images/Group.png" width="20px" height="15px" /></a>
                    </div>
                    <div>
                      <h3 className="text-center">{90}</h3>
                    </div>
                    <div className="d-grid gap-3 mt-1">
                      <button className="btn btn-success btn-block ">Add to Cart</button>
                      <button className="btn btn-white btn-block border border-success mb-1 ">Explore</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default CheckProductCartResponsiveness;