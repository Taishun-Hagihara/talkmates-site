import { useLang } from "../contexts/LangContext";
import TalkMatesLogo from "../assets/TalkMatesLogo.png";

export default function Home() {
    const { lang } = useLang();
    return (
        <div>
            <header>
                <div>
                    <img
                        src={TalkMatesLogo}
                        alt="TalkMates logo"
                        style={{ width: 160, height: 160, display: "block" }}
                    />

                </div>
            </header>
            <h1>TalkMates</h1>
            <p>
                {lang === "ja"
                    ? "国際交流サークルです。Eventsページを見てね。"
                    : "We are an international exchange circle. Check the Events page."}
            </p>
        </div>
    );
}
