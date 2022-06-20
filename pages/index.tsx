import Link from 'next/link'
import {io} from "socket.io-client"

export default function Home() {

  const socket =io()

  socket.on("connected", data => {
    console.log("received: ", data)
  })

  return (
    <ul>
      <li>
        <Link href="/a" as="/a">
          <a>a</a>
        </Link>
      </li>
      <li>
        <Link href="/b" as="/b">
          <a>b</a>
        </Link>
      </li>
    </ul>
  )
}
