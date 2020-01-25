import React from 'react';

const Logo = () => (
    <div className="logo">
        <img
            src="//res.cloudinary.com/trevo/image/upload/c_scale,f_auto,q_auto,w_200/v1566389548/mtweb/marco_trevisani_web_developer.png"
            srcSet="//res.cloudinary.com/trevo/image/upload/c_scale,f_auto,q_auto,w_400/v1566389548/mtweb/marco_trevisani_web_developer.png 2x,
            https://res.cloudinary.com/trevo/image/upload/c_scale,f_auto,q_auto,w_600/v1566389548/mtweb/marco_trevisani_web_developer.png 3x"
            alt="Marco Trevisani Web Developer | Cartoon"
        />
        <h1>MARCO TREVISANI</h1>
        <h2>Web Developer</h2>

        <style jsx>{`
            .logo {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }

            img {
                width: 200px;
            }

            h1 {
                font-family: 'Gugi', cursive;
                margin: 0;
            }

            h2 {
                font-family: 'Comfortaa', cursive;
                margin: 0;
                font-weight: normal;
            }
        `}</style>
    </div>
);

export default Logo;
