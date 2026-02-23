import React from "react"
import { FormProvider } from "react-hook-form"
import { UseLoginHFManager } from "../hooks/useLoginHFManager"
import { LoginSchema, type LoginSchemaType } from "../../../schemas/auth/loginSchema"

export const Login = () => {
    const loginSchema = LoginSchema()
    const defaultValues: LoginSchemaType = {
        email: "",
        password: ""
    }
    const loginHFManager = UseLoginHFManager({ defaultValues, schema: loginSchema })
    return (
        <React.Fragment >
            <FormProvider {...loginHFManager.methods}>
                <form onSubmit={loginHFManager.methods.handleSubmit(loginHFManager.handleSubmit, loginHFManager.handleError)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        
                        <input
                            {...loginHFManager.methods.register("email")}
                            type="text"
                            className="form-control"
                            placeholder="email@mail.com"
                        />
                        <small id="helpId" className="text-muted">Help text</small>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Password</label>
                        <input
                            {...loginHFManager.methods.register("password")}
                            type="password"
                            className="form-control"
                            placeholder="****"
                        />
                        <small id="helpId" className="text-muted">Help text</small>
                    </div>
                    <div className="mb-3">
                        <button type="submit">Login</button>
                    </div>

                </form>
            </FormProvider>
        </React.Fragment>
    )
}