import React, { FC } from "react";
import { useReward } from "react-rewards";

export const TaxFight: FC = () => {
    const { reward, isAnimating } = useReward("rewardId", "confetti");

    const hello = () => {
        if (!isAnimating) {
            reward();
            window.setTimeout(function () {
                reward();
            }, 5000);
        }
    }

    return (
        <div>
            <button onClick={() => hello()}>Button</button>
            <span id="rewardId" />
        </div>
    );
};

export default TaxFight;