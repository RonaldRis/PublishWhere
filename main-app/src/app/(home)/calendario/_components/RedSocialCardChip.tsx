import { Card, CardContent } from "@/components/ui/card";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { labelsProviderToColor } from "@/lib/constantes";
import { ISocialMediaAccount } from "shared-lib/models/socialMediaAccount.model";
import { DeleteIcon } from "lucide-react";
import { set } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

function ContentRedSociaChip({ social }: { social: ISocialMediaAccount }) {
    return (
        <>
            <Image
                src={social.thumbnail}
                width={50}
                height={50}
                className="rounded-full"
                alt="Description of the image"
                style={{ objectFit: "contain" }}
            />

            <div>

                <p className="text-center font-bold m-0 text-xl pb-2">
                    {social.name}
                </p>
                <div className="relative w-full">
                    <p className="text-center mx-6">{social.provider}</p>

                </div>
            </div>
        </>
    );
}


export default function RedSocialCardChip({ social }: { social: ISocialMediaAccount }) {

    const color = labelsProviderToColor[social.provider];
    const { selectedRedesSocialesList,
        selectedEvent,
        setSelectedRedesSocialesList } = useContext(CalendarioContext);

    const [url, setUrl] = useState<null | string>(null);

    useEffect(() => {
        if (selectedEvent) {

            selectedEvent.socialMedia.map((socialMedia) => {
                if (socialMedia.socialMedia._id === social._id) {
                    setUrl(socialMedia.urlPost);
                }
            });
        }
    }, [selectedEvent]);

    const isSelected = selectedRedesSocialesList.some((red) => red._id === social._id);

    const handlerClick = async () => {

        if (selectedEvent)
            return; //No editable


        if (selectedRedesSocialesList.some((red) => red._id === social._id)) {
            const filterList = selectedRedesSocialesList.filter((red) => red._id !== social._id);
            setSelectedRedesSocialesList(filterList);
            return;
        }
        setSelectedRedesSocialesList([...selectedRedesSocialesList, social])
    };

    return (
        <Card className={`h-full border-4 border-${color}-500 ${isSelected ? "bg-" + color + "-500" : ""}`} key={social._id} onClick={handlerClick}>
            <CardContent className="flex justify-between items-center p-3 h-full">

                {url ?

                    <Link href={url} target="_blank" className="flex justify-between items-center h-full">
                        <ContentRedSociaChip social={social} />
                    </Link>
                    :
                    <ContentRedSociaChip social={social} />
                }

            </CardContent>
        </Card>
    );
}