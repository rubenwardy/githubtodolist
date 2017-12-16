const Koa = require("koa")
const Router = require("koa-router")
const parse = require("co-body")

const app = new Router()
const koa = new Koa()

// x-response-time
koa.use(async function (ctx, next) {
	const start = new Date()
	await next()
	const ms = new Date() - start
	ctx.set("X-Response-Time", `${ms}ms`)
})

// logger
koa.use(async function (ctx, next) {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

// error catching
koa.use(async (ctx, next) => {
	try {
		await next()
	} catch (e) {
		ctx.status = e.status || 500
		ctx.body = { error: e.toString() }
	}
})

// OAuth token
app.post("/webhook", async (ctx) => {
	const body = await parse.form(ctx.req)

	ctx.body = JSON.stringify(body);
})

koa.use(app.routes())
koa.use(app.allowedMethods())
koa.listen(3000)
