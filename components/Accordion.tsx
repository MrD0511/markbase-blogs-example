import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

type FaqProps = {
    label: string,
    children: React.ReactNode
}

export default function AccordionComponent(
    { label, children }: FaqProps
){

    return (
        <Accordion className="w-full my-4">
            <AccordionItem 
                value="accordion"
                className="rounded-lg border bg-card px-4"
            >
                <AccordionTrigger className="text-left font-medium text-lg">
                    {label || 'Untitled label'}
                </AccordionTrigger>

                <AccordionContent>
                    <div
                        className="
                        text-slate-600
                        dark:text-slate-300

                        [&_p]:mb-3

                        [&_ul]:ml-5
                        [&_ul]:list-disc

                        [&_ol]:ml-5
                        [&_ol]:list-decimal

                        [&_a]:text-sky-500
                        [&_a]:underline

                        [&_strong]:font-semibold
                        "
                    >
                        {children}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}