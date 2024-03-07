import React, { useEffect, useRef } from 'react';
import { useProductState } from './context/ProductContext';
import {  useState } from "react";

const Modal360 = ({ data }) => {
    const { show360Modal, setShow360Modal } = useProductState();
    // const [imagePath, setImagePaths] = useState([]);

    // useEffect(() => {
    //     // Dynamically import all images from the folder
    //     const importImages = async () => {
    //         const importedImages = [];
    //         const numImages = 30; // Change this number according to your actual count
    //         for (let i = 1; i <= numImages; i++) {
    //             try {
    //                 const imagePath = await import(`../Shop/img/${i}.png`);
    //                 importedImages.push(imagePath.default);
    //             } catch (error) {
    //                 console.error('Error importing image:', error);
    //             }
    //         }
    //         setImagePaths("/src/router/Shop/img/");
    //     };

    //     importImages();
    // }, []);
    const modalRef = useRef(null);
    let call = 0;
let imgpath ="."
    const loaderNone = (id) => {
        window.addEventListener('load', () => {
            const loader = document.querySelector(`#${id} .loader`);
            if (loader) loader.style.display = 'none';
        });
    };

    const pdt360DegViewer = (id, n, p, t, draggable) => {
        console.log(id,n,p,t,draggable,"loffffffff")
        console.log(`${call}-${id}-${draggable ? 'draggable ' : ''}`);
        call++;
        loaderNone(id);
        let i = 1, j = 0, move = [];

        const imgRef = useRef(null);

        useEffect(() => {
            const imgElement = imgRef.current;

            const touchFun = () => {
                imgElement.addEventListener('touchmove', logic);
                imgElement.addEventListener('touchend', () => {
                    move = [];
                });
            };

            const nonTouch = () => {
                let drag = false;

                imgElement.addEventListener('mousedown', (e) => {
                    drag = true;
                    logic(e);
                });

                imgElement.addEventListener('mouseup', () => {
                    drag = false;
                    move = [];
                });

                imgElement.addEventListener('mousemove', (e) => {
                    if (drag) logic(e);
                });

                imgElement.addEventListener('mouseleave', () => {
                    move = [];
                });
            };

            const logic = (e) => {
                j++;
                const touch = e.touches && e.touches[0];
                const x = touch ? touch.clientX : e.clientX;
                const coord = x - imgElement.offsetLeft;
                move.push(coord);

                const l = move.length;
                const oldMove = move[l - 2];
                const newMove = move[l - 1];
                const thresh = touch ? true : !(j % 3);
                if (thresh) {
                    if (newMove > oldMove) nxt();
                    else if (newMove < oldMove) prev();
                }
            };

            const prev = () => {
                if (i <= 1) {
                    i = n;
                    imgElement.src = `${p}${--i}.${t}`;
                    console.log(imgElement.src,"dfff");
                    nxt();
                } else imgElement.src = `${p}${--i}.${t}`;
            };

            const nxt = () => {
                if (i >= n) {
                    i = 1;
                    imgElement.src = `${p}${++i}.${t}`;
                    console.log(imgElement.src,"dfff");

                    prev();
                } else imgElement.src = `${p}${++i}.${t}`;
            };

            const isTouch = window.matchMedia("screen and (max-width: 992px)").matches;
            if (isTouch) touchFun();
            else nonTouch();

            return () => {
                // Cleanup code here if necessary
            };
        }, [id, n, p, t, draggable]);

        return (
            <div id={id} className="viewer">
                <img
                    ref={imgRef}
                    className={`${id} ${draggable ? 'draggable' : ''}`}
                    draggable={false}
                    src={`${p}${i}.${t}`}
                    alt="360 View"
                />
                <div className="loader">
                    <div className="three-bounce">
                        <div className="one"></div>
                        <div className="two"></div>
                        <div className="three"></div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const modalElement = modalRef.current;
        if (show360Modal) {
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            modalElement.setAttribute('aria-hidden', 'false');
        } else {
            modalElement.style.display = '';
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
        }
    }, [show360Modal]);

    const handleClose = () => {
        document.body.classList.remove('modal-open');
        const modalBackdrops = document.getElementsByClassName('modal-backdrop');
        while (modalBackdrops[0]) {
            document.body.removeChild(modalBackdrops[0]);
        }
        setShow360Modal(false);
    };

    return (
        <div ref={modalRef} className="modal" id="explore360Modal" tabIndex="-1" role="dialog" aria-labelledby="exploreModalLabel" data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{ minHeight: "400px" }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">360 view of product</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {pdt360DegViewer('car3', 51,"/src/router/Shop/img/", 'png', true)}
                        <div id="dummy"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal360;
