import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";

AppDataSource.initialize().then(async () => {

    const app = express();

    app.use(express.json());

    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.listen(3000);

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Arsen",
            lastName: "Poghosyan",
            age: 27
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Lusine",
            lastName: "Grigoryan",
            age: 24
        })
    )

    console.log("Express server has started on port 3000")

}).catch(error => console.log(error))
