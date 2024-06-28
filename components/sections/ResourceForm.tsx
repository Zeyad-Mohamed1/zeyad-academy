"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Course, Resource, Section } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import FileUpload from "@/components/custom/FileUpload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters long",
  }),
  fileUrl: z.string().min(2, {
    message: "File is required",
  }),
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        values
      );

      toast.success("New resource uploaded!");

      router.refresh();
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload resource");
    }
  }

  async function onDelete(id: string) {
    try {
      await axios.delete(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
      );

      toast.success("Resource deleted!");

      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete Resource");
    }
  }

  return (
    <>
      <div className="flex gap-2 items-center text-xl font-bold mt-12">
        <PlusCircle />
        Add Resources (optional)
      </div>
      <p className="text-sm font-medium my-2">
        Add Resources to section to help students learn better.
      </p>

      <div className="mt-5 flex flex-col gap-5">
        {section.resources.map((resource) => (
          <div className="flex justify-between bg-[#fff8eb] rounded-lg text-sm font-medium p-3">
            <div className="flex items-center">
              <File className="w-4 h-4 mr-4" />
              {resource.name}
            </div>
            <div
              onClick={() => onDelete(resource.id)}
              className="text-[#fdab04]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
          </div>
        ))}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 my-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Textbook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                      endpoint="sectionResource"
                      page="Edit Section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ResourceForm;
