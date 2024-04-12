"use client";
import React, { Suspense, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Facebook, FacebookIcon, Instagram, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";

interface IsocialMediaData {
  name: string;
  imageUrl: string;    
}

function NuevaRedSocialPage() {
  const socialmente: IsocialMediaData[] = [
    {
      name: "Facebook",
      imageUrl: "https://icons8.com/icon/118497/facebook",
    },
    {
      name: "Instagram",
      imageUrl: "https://icons8.com/icon/32323/instagram",
    },
    {
      name: "Twitter X",
      imageUrl: "https://icons8.com/icon/phOKFKYpe00C/twitterx",
    },
    {
      name: "Tiktok",
      imageUrl: "https://icons8.com/icon/118640/tiktok",
    },
    {
      name: "Youtube",
      imageUrl: "https://icons8.com/icon/19318/youtube",
    },
  ];

  return (
    <Suspense>
      <Card className="container">
        <CardHeader>
          <CardTitle>Agregar nueva red social </CardTitle>
          <CardDescription>Selecciona una red social</CardDescription>
        </CardHeader>

        <CardContent className="h-2/3 ">
          <div className="flex gap-8 flex-wrap items-center justify-between">
            {socialmente.map((item: IsocialMediaData) => (
              <Link key={item.name} href="/api/auth/google">
                <Button className="flex flex-col items-center justify-center bg-black">
                    {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>

        <Separator className="my-2" />

        <CardFooter>
          <Button className="w-full">Nueva marca</Button>
        </CardFooter>
      </Card>
    </Suspense>
  );
}

export default NuevaRedSocialPage;
