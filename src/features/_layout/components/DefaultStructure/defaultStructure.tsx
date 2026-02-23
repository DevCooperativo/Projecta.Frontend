import type { ReactNode } from "react"
import React from "react"

export interface IDefaultStructure {
    navbar: ReactNode
}
export const DefaultStructure = ({ navbar }: IDefaultStructure) => {
    return (
        <React.Fragment>
            {navbar}
        </React.Fragment>
    )
}