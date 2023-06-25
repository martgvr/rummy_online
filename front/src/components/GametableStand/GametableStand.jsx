import React from "react"
import './gametablestand.css'

import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import GametableTile from "../GametableTile/GametableTile"

function GametableStand({ cards, last, setCards }) {
    const handleDragEnd = (event) => {
        const { active, over } = event

        setCards((cards) => {
            const oldIndex = cards.findIndex(card => card == active.id)
            const newIndex = cards.findIndex(card => card == over.id)

            return arrayMove(cards, oldIndex, newIndex)
        })
     }

	return(
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
            <div className="gametable__stand flex-row">
                <SortableContext items={cards} strategy={horizontalListSortingStrategy} >
                    {
                        cards.map(card => 
                            <GametableTile key={card} number={card} last={card == last && true} />
                        )
                    }
                </SortableContext>
            </div>
        </DndContext>
    )
}

export default GametableStand
