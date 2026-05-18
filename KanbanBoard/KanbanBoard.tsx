import * as React from 'react';
import { useState, useEffect } from 'react';
import { Stack, IStackStyles, DocumentCard } from '@fluentui/react';
// Importamos las herramientas de arrastre
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface ITarea {
    id: string;
    titulo: string;
    estado: string;
}

export interface IKanbanBoardProps {
    primaryColor: string;
    tareas: ITarea[];
    // Preparamos el cable para avisar a index.ts cuando algo se mueva
    onStatusChange?: (tareaId: string, nuevoEstado: string) => void;
}

const containerStyles: IStackStyles = {
    root: { display: 'flex', flexDirection: 'row', width: '100%', minHeight: '100vh', padding: '20px', gap: '20px', backgroundColor: '#f3f2f1', fontFamily: 'Segoe UI, sans-serif' }
};

const columnStyles = (colorElegido: string): React.CSSProperties => ({
    flex: 1, backgroundColor: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderTop: `6px solid ${colorElegido}`, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden'
});

export const KanbanBoard: React.FC<IKanbanBoardProps> = (props) => {
    const colorSeguro = (props.primaryColor === 'val' || !props.primaryColor) ? '#0078d4' : props.primaryColor;
    
    // UI OPTIMISTA: Estado local para que el arrastre sea instantáneo
    const [tareasLocales, setTareasLocales] = useState<ITarea[]>([]);

    useEffect(() => {
        setTareasLocales(props.tareas);
    }, [props.tareas]);

    // Esta función se dispara justo cuando sueltas el ratón
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Si la sueltas fuera del tablero o en el mismo sitio, no hacemos nada
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const nuevoEstado = destination.droppableId;

        // Actualizamos la pantalla de React inmediatamente
        const nuevasTareas = tareasLocales.map(t => 
            t.id === draggableId ? { ...t, estado: nuevoEstado } : t
        );
        setTareasLocales(nuevasTareas);

        // Si tenemos conectado el cable a index.ts, le avisamos del cambio
        if (props.onStatusChange) {
            props.onStatusChange(draggableId, nuevoEstado);
        }
    };

    const renderColumn = (tituloColumna: string, estadoFiltro: string, icono: string) => {
        const tareasColumna = tareasLocales.filter(t => t.estado === estadoFiltro);

        return (
            <div style={columnStyles(colorSeguro)} key={estadoFiltro}>
                <h3 style={{ textAlign: 'center', color: '#323130', margin: '0 0 10px 0' }}>{icono} {tituloColumna}</h3>
                <hr style={{ border: '1px solid #edebe9', width: '100%', marginBottom: '15px' }}/>
                
                {/* ZONA DONDE SE PUEDE SOLTAR */}
                <Droppable droppableId={estadoFiltro}>
                    {(provided) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            style={{ flexGrow: 1, minHeight: '100px' }} 
                        >
                            {tareasColumna.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#605e5c', fontStyle: 'italic' }}>Sin tareas</p>
                            ) : (
                                tareasColumna.map((tarea, index) => (
                                    // LA TARJETA QUE SE PUEDE ARRASTRAR
                                    <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    marginBottom: '10px',
                                                    // Hacemos que sea un poco transparente mientras vuela
                                                    opacity: snapshot.isDragging ? 0.8 : 1 
                                                }}
                                            >
                                                <DocumentCard style={{ padding: '15px', width: '100%', maxWidth: '100%', minWidth: 'auto', boxSizing: 'border-box', borderLeft: `4px solid ${colorSeguro}` }}>
                                                    <div style={{ fontWeight: '600', color: '#323130', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                        {tarea.titulo}
                                                    </div>
                                                </DocumentCard>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            )}
                            {/* Espacio invisible necesario para que la librería calcule distancias */}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    return (
        // CONTEXTO GLOBAL DE ARRASTRE
        <DragDropContext onDragEnd={handleDragEnd}>
            <Stack styles={containerStyles}>
                {renderColumn("Pendiente", "Pendiente", "📌")}
                {renderColumn("En Proceso", "En Proceso", "⏳")}
                {renderColumn("Finalizado", "Finalizado", "✅")}
            </Stack>
        </DragDropContext>
    );
};