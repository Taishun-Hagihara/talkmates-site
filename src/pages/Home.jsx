import { useLang } from "../contexts/LangContext";

export default function Home() {
    const { lang } = useLang();
    return (
        <div>
            <h1>TalkMates</h1>
            <p>
                {lang === "ja"
                    ? "国際交流サークルです。Eventsページを見てね。"
                    : "We are an international exchange circle. Check the Events page."}
            </p>
        </div>
    );
}
