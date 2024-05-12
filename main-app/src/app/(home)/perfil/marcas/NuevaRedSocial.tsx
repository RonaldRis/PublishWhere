"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  FacebookIcon,
  Instagram,
  InstagramIcon,
  PlusCircleIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { use } from "passport";
import { fetch_URL_SOCIAL_MEDIA_CONNECTION_SERVICE } from "@/lib/actions/env.actions";
import { set } from "mongoose";

interface IsocialMediaData {
  name: string;
  imageUrl: string;
  url: string;
}

function NuevaRedSocial() {
  const [backendUrl, setBackendUrl] = useState<string>(
    "http://localhost:3001/auth/"
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch_URL_SOCIAL_MEDIA_CONNECTION_SERVICE();

      setBackendUrl(res.data! + "/auth/");
    };
    fetchData();
  }, []);

  const socialmente: IsocialMediaData[] = [
    {
      name: "Youtube",
      imageUrl: "https://icons8.com/icon/19318/youtube",
      url: backendUrl + "youtube",
    },
    // {
    //   name: "Facebook",
    //   imageUrl: "https://icons8.com/icon/118497/facebook",
    //   url: backendUrl + "facebook",
    // },
    // {
    //   name: "Instagram",
    //   imageUrl: "https://icons8.com/icon/32323/instagram",
    //   url: backendUrl + "instagram",
    // },
    {
      name: "Twitter X",
      imageUrl: "https://icons8.com/icon/phOKFKYpe00C/twitterx",
      url: backendUrl + "twitter",
    },
    {
      name: "Tiktok",
      imageUrl: "https://icons8.com/icon/118640/tiktok",
      url: backendUrl + "tiktok",
    },
  ];

  return (
    <div >
      <br/>
      <br/>
      
      <h1 className="font-bold">Agregar nueva red social</h1>
      <br/>
      <br/>

      <div className="h-2/3 ">
        <div className="flex gap-8 flex-wrap items-center justify-evenly">
          {socialmente.map((item: IsocialMediaData) => (
            <Link key={item.url} href={item.url}>
              <Button className="flex items-center justify-center bg-black ">
                <PlusCircleIcon className="mx-2"/>
                <span className="mx-2">

                {item.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NuevaRedSocial;
