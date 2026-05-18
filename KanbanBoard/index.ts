/* eslint-disable */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { KanbanBoard as KanbanReact, IKanbanBoardProps, ITarea } from "./KanbanBoard";

export class KanbanBoard implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    
    private _container: HTMLDivElement;
    private _root: Root;
    private _context: ComponentFramework.Context<IInputs>;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._context = context;
        this._root = createRoot(this._container);
    }

    private handleStatusChange = (tareaId: string, nuevoEstado: string): void => {
        console.log("🛠️ Iniciando movimiento de tarjeta...");
        const dataset = this._context.parameters.tasksDataset as any;
        
        // 1. Buscamos el nombre real de la columna dentro de las propiedades del Dataset
        let nombreLogicoColumna = "";
        const columnas = dataset.columns || [];
        for (const col of columnas) {
            if (col.alias === "statusProperty") { // "statusProperty" es el nombre de tu alias en el Manifest
                nombreLogicoColumna = col.name;
                break;
            }
        }

        // 2. Buscamos el nombre de la tabla
        const nombreLogicoTabla = dataset.getTargetEntityType();

        console.log(`📊 Tabla detectada: ${nombreLogicoTabla}`);
        console.log(`🏷️ Columna detectada: ${nombreLogicoColumna}`);

        // Si falta algo, ¡que salte una alerta en toda la pantalla!
        if (!nombreLogicoColumna || !nombreLogicoTabla) {
            console.error("❌ ERROR CRÍTICO: No se encontró la columna o la tabla.");
            alert("Error: No se ha detectado el nombre de la columna. Revisa F12.");
            return;
        }

        // 3. Preparamos el envío
        const data: any = {};
        data[nombreLogicoColumna] = nuevoEstado;

        console.log(`🚀 Enviando a Dataverse -> Registro: ${tareaId} | Datos:`, data);

        // 4. Actualizamos
        this._context.webAPI.updateRecord(nombreLogicoTabla, tareaId, data).then(
            () => {
                console.log("✅ ¡DATAVERSE ACTUALIZADO! El flujo va a arrancar ya.");
                dataset.refresh();
            },
            (error: any) => {
                console.error("❌ Error de WebAPI rechazando el dato:", error.message);
                this._context.navigation.openErrorDialog({ message: "Dataverse ha rechazado el cambio: " + error.message });
                dataset.refresh();
            }
        );
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        const params = context.parameters as any;
        const colorElegido = params.primaryColor?.raw || "#0078d4";

        const listaTareas: ITarea[] = [];
        const dataset = params.tasksDataset;

        if (dataset && dataset.sortedRecordIds) {
            for (const recordId of dataset.sortedRecordIds) {
                const record = dataset.records[recordId];
                listaTareas.push({
                    id: recordId,
                    titulo: record.getFormattedValue("titleProperty") || "Sin título",
                    estado: record.getFormattedValue("statusProperty") || ""
                });
            }
        }

        const props: IKanbanBoardProps = {
            primaryColor: colorElegido,
            tareas: listaTareas,
            onStatusChange: this.handleStatusChange 
        };

        this._root.render(React.createElement(KanbanReact, props));
    }

    public getOutputs(): IOutputs { return {}; }
    public destroy(): void { this._root.unmount(); }
}