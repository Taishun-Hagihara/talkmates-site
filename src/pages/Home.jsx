import { useLang } from "../contexts/LangContext";


export default function Home() {
    const { lang } = useLang();
    return (
        <div className="w-full">
            <header className="w-13/15 mx-auto">
                <div className="">
                    <h1 className="text-slate-800 text-4xl mt-6 font-bold"><span className="text-green-600">Talk</span>Mates</h1>
                    <p className="text-slate-800 text-2xl font-bold mt-6">イベントサークル</p>
                    <p className="text-slate-800 text-2xl font-bold ">留学生と一緒に活動しよう！</p>
                    <div className="mt-6"><a href="https://www.instagram.com/talkmates_2025/" className=" text-blue-500">instagramへ↗︎</a></div>
                </div>
                
            </header>
            <main className="w-full">
                <div className="w-13/15 mx-auto">
                    <h2 className="text-slate-800 text-2xl mt-6 font-bold">TalkMatesとは？？</h2>
                    <p className="text-slate-800 mt-3 ">同志社大学登録団体サークルで、留学生の数が同志社No.1👑</p>
                    <p className="text-slate-800">英語が苦手な方でも大歓迎🥺</p>
                </div>
                <div>
                    <h2 className="text-slate-800 text-2xl mt-6 font-bold"><span className="text-green-600">イベント記録</span> 2025年</h2>
                </div>
            </main>


            
        </div>
    );
}
