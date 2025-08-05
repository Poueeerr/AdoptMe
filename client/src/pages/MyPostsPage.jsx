import { useEffect } from "react"
import DisplayMyPosts from "../components/DisplayMyPosts"

function MyPostsPage(){
    return(
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <DisplayMyPosts />
      </main>
    </div>)
}

export default MyPostsPage