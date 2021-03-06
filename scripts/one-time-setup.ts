import { envVar, error, log } from "@therockstorm/utils"
import "source-map-support/register"
import client, { handleError } from "./client"

const URL = "<Your ServiceEndpoint Here>"
const WEBHOOK_SECRET = envVar("WEBHOOK_SECRET")
const ROUTE = "webhook-subscriptions"

const setup = async () => {
  const subs = await client.get(ROUTE)
  const match = subs.body._embedded[ROUTE].filter((s: any) => s.url === URL)
  if (match.length > 0) {
    log(`Subscription already exists for this URL, id=${match[0].id}`)
    return
  }

  const res = await handleError(() =>
    client.post(ROUTE, { url: URL, secret: WEBHOOK_SECRET })
  )
  if (res) {
    log(`Created ${res.headers.get("location")}`)
  }
}

setup().catch(error)
