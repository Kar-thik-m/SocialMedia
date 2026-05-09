import React from "react";
import GetPost from "../../Components/GetPost/Getpost";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 px-2">Feed</h1>
                <GetPost />
            </div>
        </div>
    );
}

export default Home;