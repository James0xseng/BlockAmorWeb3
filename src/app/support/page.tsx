import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, MessageSquare, Search, FileText } from "lucide-react";

const faqItems = [
  {
    value: "item-1",
    question: "How does the Vulnerability Scanner work?",
    answer: "Our AI-powered scanner analyzes smart contract code for common vulnerabilities by comparing patterns against a vast database of known exploits and security best practices. It provides a detailed report with identified issues and suggested remediations."
  },
  {
    value: "item-2",
    question: "What is Address Reputation Scoring?",
    answer: "Address Reputation Scoring assigns a risk score to Ethereum addresses based on their transaction history, interactions with known malicious contracts, and other on-chain data. This helps you assess the risk of interacting with specific addresses."
  },
  {
    value: "item-3",
    question: "Can I integrate BlockArmor with my existing tools?",
    answer: "We are working on API integrations for various features. Please check our documentation or contact support for more information on available integrations and future plans."
  },
  {
    value: "item-4",
    question: "How accurate is the Gas Estimator?",
    answer: "The Gas Estimator provides a close approximation of gas costs based on current network conditions and transaction complexity. However, actual gas fees can fluctuate, so it's always an estimate."
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <LifeBuoy className="mr-3 h-7 w-7 text-primary" />
            Support Center
          </CardTitle>
          <CardDescription>
            Find help with BlockArmor. Search our FAQs or contact our support team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* FAQ Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center"><Search className="mr-2 h-6 w-6 text-muted-foreground"/>Frequently Asked Questions</h3>
            <Input placeholder="Search FAQs..." className="mb-4"/>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map(item => (
                <AccordionItem value={item.value} key={item.value}>
                  <AccordionTrigger className="text-base hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Contact Support Section */}
          <section className="space-y-4 p-6 border rounded-lg shadow-sm bg-card">
            <h3 className="text-xl font-semibold flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-muted-foreground"/>Contact Support</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <form className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Issue with Vulnerability Scan" className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." rows={5} className="mt-1"/>
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
            </form>
          </section>

          {/* Documentation Link */}
          <section className="space-y-2 text-center">
             <h3 className="text-xl font-semibold flex items-center justify-center"><FileText className="mr-2 h-6 w-6 text-muted-foreground"/>Documentation</h3>
            <p className="text-muted-foreground">
              For more detailed information, please visit our comprehensive documentation.
            </p>
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                View Documentation
              </a>
            </Button>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
