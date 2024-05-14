import { Card, CardContent } from "@/components/ui/card";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { labelsProviderToColor } from "@/lib/constantes";
import { ISocialMediaAccount } from "shared-lib/models/socialMediaAccount.model";
import { DeleteIcon } from "lucide-react";
import { set } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

export default function RedSocialCardChip({ social }: { social: ISocialMediaAccount }) {

    const color = labelsProviderToColor[social.provider];
    const { selectedRedesSocialesList,
        setSelectedRedesSocialesList } = useContext(CalendarioContext);

    const isSelected = selectedRedesSocialesList.some((red) => red._id === social._id);

    const handlerClick = async () => {
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
            </CardContent>
        </Card>
    );
}