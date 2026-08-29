import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

type FaqProps = {
    question: string,
    children: React.ReactNode
}

export default function Faq(
    { question, children }: FaqProps
){

    return (
        <Accordion className="w-full my-4">
            <AccordionItem 
                value="faq"
                className="rounded-lg border bg-card px-4"
            >
                <AccordionTrigger className="text-left font-medium text-lg">
                    {question || 'Untitled question'}
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