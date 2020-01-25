import React from 'react';
import Head from 'next/head';
import Logo from '../components/logo';
import Socials from '../components/socials';

const Home = () => (
    <div>
        <Head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1"
            />
            <meta name="author" content="Marco Trevisani" />
            <meta
                name="description"
                content="Web Developer Bologna. Attualmente ricopro il ruolo Frontend
                Architect presso Yoox Net-a-Porter Group. Sito ufficiale in
                arrivo..."
            />
            <meta
                name="keywords"
                content="marco trevisani, web, developer, frontend, architect"
            />
            <title>Marco Trevisani Web Developer | MT Web</title>
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com/"
                crossOrigin="true"
            />
            <link
                rel="preconnect"
                href="https://res.cloudinary.com/"
                crossOrigin="true"
            />
            <link
                rel="apple-touch-icon"
                sizes="57x57"
                href="static/ico/apple-icon-57x57.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="60x60"
                href="static/ico/apple-icon-60x60.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="72x72"
                href="static/ico/apple-icon-72x72.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="76x76"
                href="static/ico/apple-icon-76x76.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="static/ico/apple-icon-114x114.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="120x120"
                href="static/ico/apple-icon-120x120.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="static/ico/apple-icon-144x144.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="static/ico/apple-icon-152x152.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="static/ico/apple-icon-180x180.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="static/ico/android-icon-192x192.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="static/ico/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="96x96"
                href="static/ico/favicon-96x96.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="static/ico/favicon-16x16.png"
            />
            <link rel="manifest" href="static/manifest.json" />
            <meta name="msapplication-TileColor" content="#87cefa" />
            <meta
                name="msapplication-TileImage"
                content="static/ico/ms-icon-144x144.png"
            />
            <meta name="theme-color" content="#87cefa" />
            <link
                href="https://fonts.googleapis.com/css?family=Comfortaa:300|Gugi&display=swap"
                rel="stylesheet"
            />
        </Head>
        <Logo />
        <Socials />
        <div className="coming-soon">coming soon...</div>
        <style jsx>{`
            :global(body) {
                color: azure;
                background-color: lightskyblue;
            }
            .coming-soon {
                position: fixed;
                bottom: 10px;
                right: 25px;
                font-family: 'Comfortaa', cursive;
            }
        `}</style>
    </div>
);

export default Home;
