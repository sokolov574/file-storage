/* import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    query: z.string().min(1).max(200),
  })
export function SearchBar() {
    const orgId: string = ""; // Declare the variable orgId with an initial value

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return;
    }
    return <div>
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                
                <Button 
                type="submit"
                disabled={form.formState.isSubmitting} 
                className="flex gap-1">
                {form.formState.isSubmitting && 
                <Loader2 className="h-4 w-4 animate-spin" />
                }
                <SearchIcon /> Search
                </Button>
              </form>
            </Form>
    </div>
    
} */


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  query: z.string().min(1).max(200),
});

export function SearchBar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

  }

  return (
    <div>
      <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                type="submit"
                disabled={form.formState.isSubmitting} 
                className="flex gap-1">
                {form.formState.isSubmitting && 
                <Loader2 className="h-4 w-4 animate-spin" />
                }
                <SearchIcon /> Search
                </Button>
              </form>
            </Form>
    </div>
  );
}