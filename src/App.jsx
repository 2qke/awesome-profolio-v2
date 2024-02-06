import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar';
import ProgressBar from "@ramonak/react-progress-bar";
import SpotifyPlayer from 'react-spotify-player';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import cfg from './config.json'
import 'tippy.js/dist/tippy.css';
import tippy from 'tippy.js';
import 'tippy.js/animations/shift-away.css';

const Spotify = (props) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timestamps = props.spotify.timestamps;
        const currentTime = Date.now() - timestamps.start;
        const totalTime = timestamps.end - timestamps.start;
        setProgress(currentTime / totalTime * 100);
    }, [props.spotify])

    useEffect(() => {
        tippy('[data-tippy-content]', {
            placement: 'top',
            allowHTML: true,
            animation: 'shift-away'
        });
    }, []);

    return (
        <div
            className="select-none w-full rounded-2xl p-5 h-24 flex shadow-2xl justify-center items-center flex-row backdrop-blur-3xl shadow-large"
        >
            <div className="flex justify-center flex-col">
                <img
                    src={props.spotify.album_art_url}
                    alt="Album Cover"
                    width={92}
                    className="rounded-xl select-none"
                />
            </div>
            <div className="w-full h-full px-2 m-1 flex flex-col justify-between">
                <div className="w-full  h-full flex flex-col">
                    <span className="lg:text text text-xs mb-1 font-semibold">{props.spotify.artist}</span>
                    <span className="lg:text lg:text-xs text -translate-y-[2px] text-[10px]">{props.spotify.song}</span>
                </div>
                <ProgressBar className="-translate-y-2 lg:translate-y-0" height="6px" bgColor="#27a80d" completed={progress} transitionDuration="0.1s" customLabel=" " />
            </div>
        </div>
    )
}

const Link = (props) => {
    return (
        <a className="select-none duration-500 ease-out hover:-translate-y-2" href={`https://${props.href}`}>
            <img
                src={props.src}
                alt={props.linkType}
                width={42}
                className="select-none"
            />
        </a>
    )
}

const App = () => {
    const [user, setUser] = useState({ username: "ebu", discriminator: "0000" });
    const [isLoaded, setIsLoaded] = useState(false);
    const [spotify, setSpotify] = useState(
        {
            album: "Listening Nothing",
            album_art_url: "nolistening.png",
            timestamps: { start: 0, end: 0 },
            song: "Listening Nothing"
        }
    )

    useEffect(() => {
        const retrieveUser = async () => {
            try {
                const result = await fetch(`https://api.lanyard.rest/v1/users/${cfg.discord_id}`);
                const json = await result.json();
                await setUser(json.data.discord_user);

                if (json.data.listening_to_spotify) {
                    await setSpotify(json.data.spotify);
                } else {
                    await setSpotify(
                        {
                            album: "Listening Nothing",
                            album_art_url: "nolistening.png",
                            timestamps: { start: 0, end: 0 },
                            song: "Listening Nothing"
                        }
                    );
                }

                document.title = `Home | ${json.data.discord_user.global_name}`;

                setIsLoaded(true);
            } catch (err) {
                setIsLoaded(false);
            }
        }
        retrieveUser();

        setInterval(retrieveUser, 1000);
    }, [])

    return (
        <div className="w-full h-full flex justify-center items-center bg-[url('https://i.hizliresim.com/51qtheq.gif')] bg-cover bg-no-repeat bg-center">
            <LoadingBar progress={100} color="#4e1b56" />
            <div className={`border-white/30 border ${isLoaded ? "animate-starting-animation" : "opacity-0"} w-11/12 lg:w-3/4 xl:w-1/2 h-auto lg:h-[75vh] rounded-2xl duration-300 justify-center flex flex-col p-4 md:p-10 gap-2 md:gap-4 bg-opacity-90 bg-[rgba(17, 25, 40, 0.75)] backdrop-blur-2xl drop-shadow-lg`}>
                <div className="absolute top-0 right-0 m-4 flex flex-1 justify-end mx-end items-center">
                    <a target="_blank" rel="noreferrer" href="https://open.spotify.com/intl-tr/track/1mXy0SZUvVY7oW2QQrXYPm?si=d016aeae9c294d2f" className="text-white/50 font-semibold hover:text-white/90 duration-300" data-tippy-content="Please click">#SOMEBODY</a>
                </div>
                <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <img
                        alt="pfp.png"
                        src="https://api.lanyard.rest/694349924388569170.png"
                        draggable="false"
                        onError="https://api.lanyard.rest/694349924388569170.png"
                        className="rounded-full bg-gradient-to-r to-pink-500 from-blue-500 p-1 hover:opacity-80 duration-300"
                        width={128}
                    />
                    <span className="titleText font-semibold">{user.username}</span>
                </div>

                <div className="flex justify-center mx-auto items-center flex-col space-y-2">
                    <span className="px-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-md text-white font-semibold hover:opacity-50 duration-300 cursor-pointer"> <FontAwesomeIcon className="mr-1" icon={faCode} />Frontend Developer</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                    {cfg.display_text.map((e, index) => <span key={index} className="text text-opacity-90 text-xs md:text-sm">{e}</span>)}
                </div>
                {!cfg.spotify.artist ? <Spotify spotify={spotify} /> :
                    <div className="flex justify-center">
                        <SpotifyPlayer uri={`spotify:artist:${cfg.artist_id}`} size={{ width: '100%', height: 300 }} view={'list'} theme={'black'} />
                    </div>
                }
                <div className="flex flex-row items-end justify-center my-3 md:my-5 gap-1 md:gap-2">
                    {cfg.social_links.map((e, index) => <Link key={index} src={e.image} href={e.href} linkType={e.linkType} />)}
                </div>

                {/* Desktop and Tablet Layout */}
                <div className="flex flex-row items-end justify-center gap-1 md:gap-2 inset bg-white bg-opacity-10 rounded-md p-1 md:p-2 px-2 md:px-4 inline-block mx-auto items-center">
                    <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                        {cfg.inset.map((e, index) => (
                            <img
                                key={index}
                                src={e.image}
                                alt={e.title}
                                data-tippy-content={e.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;