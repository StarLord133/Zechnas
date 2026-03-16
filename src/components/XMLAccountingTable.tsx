"use client"

import { useState, useCallback } from "react"
import { XMLParser } from "fast-xml-parser"
import { Upload, FileBarChart, Eye, Download, ArrowLeft, Printer, DollarSign, Activity, Calendar } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- Mock Data ---
const HISTORY_DATA = [
    { month: 'Jul', uploaded: 45000, processed: 42000 },
    { month: 'Ago', uploaded: 52000, processed: 48000 },
    { month: 'Sep', uploaded: 48000, processed: 48000 },
    { month: 'Oct', uploaded: 61000, processed: 58000 },
    { month: 'Nov', uploaded: 55000, processed: 65000 },
    { month: 'Dic', uploaded: 75000, processed: 72000 },
];

const BILLING_KPIS = [
    { label: "Total Procesado (Mes)", value: "$764,230", trend: "+12.5%", icon: DollarSign, color: "text-[#D4AF37]" },
    { label: "Facturas Pendientes", value: "23", trend: "-5 vs mes anterior", icon: Activity, color: "text-blue-400" },
    { label: "Próximo Cierre Fiscal", value: "17 Ene", trend: "3 días restantes", icon: Calendar, color: "text-white/60" },
];

interface InvoiceData {
    uuid: string
    date: string
    serie: string
    folio: string
    rfcEmitter: string
    nameEmitter: string
    concept: string
    subtotal: number
    discount: number
    transferredTax: number
    retainedTax: number
    total: number
    rawData?: any
}

// Helper to parse currency (reused)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount)
}

function InvoiceDetail({ invoice, onBack }: { invoice: InvoiceData, onBack: () => void }) {
    // Try to extract extra info safe-guarding against missing fields
    const comprobante = invoice.rawData?.["cfdi:Comprobante"] || invoice.rawData?.["Comprobante"] || {};
    const receptor = comprobante["cfdi:Receptor"] || comprobante["Receptor"] || {};
    const conceptosRaw = comprobante["cfdi:Conceptos"] || comprobante["Conceptos"];

    let conceptosList = [];
    if (conceptosRaw) {
        conceptosList = Array.isArray(conceptosRaw["cfdi:Concepto"])
            ? conceptosRaw["cfdi:Concepto"]
            : [conceptosRaw["cfdi:Concepto"]];
    } else if (Array.isArray(conceptosRaw)) {
        // Fallback for some parsers that might flatten directly
        conceptosList = conceptosRaw;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-white/60 hover:text-[#D4AF37] hover:bg-white/5 pl-0 gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al listado
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                        <Download className="w-4 h-4 mr-2" />
                        XML
                    </Button>
                    <Button variant="default" className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir PDF
                    </Button>
                </div>
            </div>

            {/* Main Info Card */}
            <Card className="bg-black border border-white/10 p-8 shadow-xl">
                {/* Top Status Bar */}
                <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Factura {invoice.serie && <span className="text-[#D4AF37]">{invoice.serie}-</span>}{invoice.folio || "S/N"}
                        </h1>
                        <p className="text-white/40 text-sm font-mono">UUID: {invoice.uuid}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">TOTAL FACTURA</p>
                        <p className="text-3xl font-bold text-[#D4AF37]">{formatCurrency(invoice.total)}</p>
                        <p className="text-white/50 text-xs mt-1">{invoice.date}</p>
                    </div>
                </div>

                {/* Entities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                    {/* Emitter */}
                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 mb-3">Emisor</h3>
                        <p className="text-white font-medium text-lg">{invoice.nameEmitter}</p>
                        <p className="text-white/60 font-mono text-sm">{invoice.rfcEmitter}</p>
                        <p className="text-white/40 text-xs mt-2">{comprobante["cfdi:Emisor"]?.RegimenFiscal && `Régimen: ${comprobante["cfdi:Emisor"]?.RegimenFiscal}`}</p>
                    </div>

                    {/* Receiver */}
                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 mb-3">Receptor</h3>
                        <p className="text-white font-medium text-lg">{receptor.Nombre || receptor.nombre || "PÚBLICO EN GENERAL"}</p>
                        <p className="text-white/60 font-mono text-sm">{receptor.Rfc || receptor.rfc || "XAXX010101000"}</p>
                        <p className="text-white/40 text-xs mt-2">{receptor.UsoCFDI && `Uso CFDI: ${receptor.UsoCFDI}`}</p>
                    </div>
                </div>

                {/* Concepts Table */}
                <div className="mt-8 mb-8">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Conceptos Detallados</h3>
                    <div className="rounded border border-white/10 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#0a0a0a]">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-white/60 text-xs h-9">Cant.</TableHead>
                                    <TableHead className="text-white/60 text-xs h-9">Clave</TableHead>
                                    <TableHead className="text-white/60 text-xs h-9 w-[40%]">Descripción</TableHead>
                                    <TableHead className="text-white/60 text-xs h-9 text-right">P. Unitario</TableHead>
                                    <TableHead className="text-white/60 text-xs h-9 text-right">Importe</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {conceptosList.map((c: any, idx: number) => (
                                    <TableRow key={idx} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="text-white/80 py-3">{c.Cantidad || c.cantidad}</TableCell>
                                        <TableCell className="text-white/50 font-mono text-xs py-3">{c.ClaveProdServ || c.claveProdServ}</TableCell>
                                        <TableCell className="text-white font-medium py-3">
                                            {c.Descripcion || c.descripcion}
                                            {c.NoIdentificacion && <span className="block text-[10px] text-white/30 font-mono mt-1">SKU: {c.NoIdentificacion}</span>}
                                        </TableCell>
                                        <TableCell className="text-white/70 text-right font-mono text-xs py-3">{formatCurrency(parseFloat(c.ValorUnitario || c.valorUnitario))}</TableCell>
                                        <TableCell className="text-white text-right font-mono text-xs py-3 font-bold">{formatCurrency(parseFloat(c.Importe || c.importe))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Detailed Financial Breakdown */}
                <div className="flex justify-end mt-8 border-t border-white/10 pt-8">
                    <div className="w-full md:w-1/3 bg-[#0f0f0f] rounded-lg p-6 border border-white/5">
                        <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold mb-4 border-b border-white/5 pb-2">Desglose Financiero</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Subtotal</span>
                                <span className="text-white font-mono">{formatCurrency(invoice.subtotal)}</span>
                            </div>

                            {invoice.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-400/80">Descuento</span>
                                    <span className="text-red-400 font-mono">-{formatCurrency(invoice.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="text-white/60">Impuestos Trasladados</span>
                                <span className="text-white font-mono">{formatCurrency(invoice.transferredTax)}</span>
                            </div>

                            {invoice.retainedTax > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Impuestos Retenidos</span>
                                    <span className="text-white font-mono">-{formatCurrency(invoice.retainedTax)}</span>
                                </div>
                            )}

                            <div className="h-px bg-white/10 my-2"></div>

                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold uppercase text-sm">Total MXN</span>
                                <span className="text-[#D4AF37] font-bold text-2xl font-mono">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

// --- Initial State ---
const INITIAL_INVOICES: InvoiceData[] = [];

export function XMLAccountingTable() {
    const [invoices, setInvoices] = useState<InvoiceData[]>(INITIAL_INVOICES)
    const [isDragging, setIsDragging] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null)

    const processFiles = async (files: FileList | File[]) => {
        setProcessing(true)
        const newInvoices: InvoiceData[] = []
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: ""
        })

        for (const file of Array.from(files)) {
            if (file.type !== "text/xml" && !file.name.endsWith(".xml")) continue

            try {
                const text = await file.text()
                const jsonObj = parser.parse(text)
                const comprobante = jsonObj["cfdi:Comprobante"] || jsonObj["Comprobante"]

                if (!comprobante) continue

                // Extract Emisor
                const emisor = comprobante["cfdi:Emisor"] || comprobante["Emisor"] || {}

                // Extract Concepts (Take the first one for summary but save raw for detail)
                const conceptos = comprobante["cfdi:Conceptos"] || comprobante["Conceptos"]
                let mainConcept = "Sin concepto"
                if (conceptos) {
                    const conceptoList = Array.isArray(conceptos["cfdi:Concepto"])
                        ? conceptos["cfdi:Concepto"]
                        : [conceptos["cfdi:Concepto"]]

                    if (conceptoList.length > 0) {
                        mainConcept = conceptoList[0].Descripcion || conceptoList[0].descripcion
                    }
                }

                // Extract Taxes (More detailed)
                let totalTraslados = 0
                let totalRetenciones = 0
                const impuestos = comprobante["cfdi:Impuestos"] || comprobante["Impuestos"]
                if (impuestos) {
                    totalTraslados = parseFloat(impuestos.TotalImpuestosTrasladados || impuestos.totalImpuestosTrasladados || "0")
                    totalRetenciones = parseFloat(impuestos.TotalImpuestosRetenidos || impuestos.totalImpuestosRetenidos || "0")
                }

                // Extract Discount
                const descuento = parseFloat(comprobante.Descuento || comprobante.descuento || "0")

                const invoice: InvoiceData = {
                    uuid: comprobante["cfdi:Complemento"]?.["tfd:TimbreFiscalDigital"]?.UUID || crypto.randomUUID(),
                    date: comprobante.Fecha || comprobante.fecha,
                    serie: comprobante.Serie || comprobante.serie || "",
                    folio: comprobante.Folio || comprobante.folio || "",
                    rfcEmitter: emisor.Rfc || emisor.rfc || "N/A",
                    nameEmitter: emisor.Nombre || emisor.nombre || "N/A",
                    concept: mainConcept,
                    subtotal: parseFloat(comprobante.SubTotal || comprobante.subTotal || "0"),
                    discount: descuento,
                    transferredTax: totalTraslados,
                    retainedTax: totalRetenciones,
                    total: parseFloat(comprobante.Total || comprobante.total || "0"),
                    rawData: jsonObj
                }
                newInvoices.push(invoice)
            } catch (error) {
                console.error("Error parsing XML:", error)
            }
        }

        setInvoices(prev => [...newInvoices, ...prev])
        setProcessing(false)
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files)
        }
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files)
        }
    }

    if (selectedInvoice) {
        return <InvoiceDetail invoice={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
    }

    return (
        <div className="space-y-6 w-full animate-in fade-in duration-300">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BILLING_KPIS.map((kpi, index) => (
                    <Card key={index} className="bg-[#0a0a0a] border border-white/10">
                        <CardContent className="p-6 flex justify-between items-start">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-bold tracking-wider">{kpi.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                                <p className="text-xs text-white/30 mt-1">{kpi.trend}</p>
                            </div>
                            <div className={`p-2 rounded bg-white/5 ${kpi.color}`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Split View: Dropzone & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dropzone */}
                <div className="lg:col-span-1">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            h-full min-h-[300px] relative group border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out cursor-pointer
                            flex flex-col items-center justify-center gap-4
                            ${isDragging
                                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                : "border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5"
                            }
                        `}
                    >
                        <input
                            type="file"
                            multiple
                            accept=".xml"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileInput}
                        />

                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/20 transition-colors">
                            <Upload className={`w-8 h-8 ${isDragging ? "text-[#D4AF37]" : "text-white/50 group-hover:text-[#D4AF37]"}`} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                                Arrastra tus Facturas XML
                            </h3>
                            <p className="text-xs text-white/40 mt-1">
                                Procesamiento automático de validación SAT.
                            </p>
                        </div>
                        {processing && <p className="text-[#D4AF37] text-xs animate-pulse">Procesando archivos...</p>}
                    </div>
                </div>

                {/* Chart */}
                <Card className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-white text-sm uppercase tracking-widest">Flujo de Facturación (Semestral)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={HISTORY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                                    cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                                />
                                <Bar dataKey="uploaded" name="Cargado" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="processed" name="Procesado" fill="#333" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Accounting Table */}
            {invoices.length > 0 ? (
                <Card className="bg-black border border-white/10 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                            <FileBarChart className="w-5 h-5 text-[#D4AF37]" />
                            <h2 className="font-semibold text-white tracking-wide text-sm uppercase">Registro Contable XML</h2>
                        </div>
                        <div className="text-xs text-white/40 font-mono">
                            {invoices.length} {invoices.length === 1 ? 'Documento' : 'Documentos'}
                        </div>
                    </div>

                    <div className="relative max-h-[600px] overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="sticky top-0 bg-[#0a0a0a] z-10 shadow-sm">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="w-[100px] text-white/60 font-medium text-xs uppercase tracking-wider h-10">Fecha</TableHead>
                                    <TableHead className="text-white/60 font-medium text-xs uppercase tracking-wider h-10">Folio</TableHead>
                                    <TableHead className="text-white/60 font-medium text-xs uppercase tracking-wider h-10">Emisor</TableHead>
                                    <TableHead className="text-white/60 font-medium text-xs uppercase tracking-wider h-10">Concepto Principal</TableHead>
                                    <TableHead className="text-right text-white/60 font-medium text-xs uppercase tracking-wider h-10">Subtotal</TableHead>
                                    <TableHead className="text-right text-white/60 font-medium text-xs uppercase tracking-wider h-10">Impuestos Trasladados</TableHead>
                                    <TableHead className="text-right text-[#D4AF37] font-bold text-xs uppercase tracking-wider h-10">Total</TableHead>
                                    <TableHead className="text-center text-white/60 font-medium text-xs uppercase tracking-wider h-10 w-[120px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.uuid} className="border-white/5 hover:bg-white/5 transition-colors group">
                                        <TableCell className="text-white/80 text-xs font-mono py-2">{inv.date.split('T')[0]}</TableCell>
                                        <TableCell className="text-white/80 text-xs py-2">{inv.serie}{inv.folio && `-${inv.folio}`}</TableCell>
                                        <TableCell className="text-white text-xs font-medium py-2">
                                            <div className="flex flex-col">
                                                <span>{inv.nameEmitter}</span>
                                                <span className="text-white/30 text-[10px] uppercase font-mono">{inv.rfcEmitter}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white/60 text-xs py-2 max-w-[200px] truncate" title={inv.concept}>
                                            {inv.concept}
                                        </TableCell>
                                        <TableCell className="text-right text-white/70 text-xs font-mono py-2">{formatCurrency(inv.subtotal)}</TableCell>
                                        <TableCell className="text-right text-white/70 text-xs font-mono py-2">{formatCurrency(inv.transferredTax)}</TableCell>
                                        <TableCell className="text-right text-[#D4AF37] font-bold text-xs font-mono py-2">{formatCurrency(inv.total)}</TableCell>
                                        <TableCell className="py-2">
                                            <div className="flex justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-white hover:text-[#D4AF37] hover:bg-white/10"
                                                    onClick={() => setSelectedInvoice(inv)}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-[#D4AF37] hover:bg-white/10">
                                                    <Download className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ) : null}
        </div>
    )
}
