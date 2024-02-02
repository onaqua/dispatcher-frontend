import { Tour, TourProps, Image } from "antd";

export interface DispatcherTourProps {
    isOpen: boolean;
    onClose(): void;
}

export const DispatcherTour: React.FC<DispatcherTourProps> = ({
    isOpen,
    onClose,
}) => {
    const steps: TourProps["steps"] = [
        {
            title: "Добро пожаловать в SmartDispatcher !",
            description:
                "Сейчас мы немного расскажем о том, что диспетчер делает для вас, и как им пользоваться.",
            cover: (
                <Image
                    preview={false}
                    src="https://www.svgrepo.com/show/402888/waving-hand.svg"
                    width={56}
                    height={56}
                ></Image>
            ),
        },

        {
            title:
                "Транспортная накладная в логистике: для чего нужна и как верно заполнить",
            description:
                "Основным транспортным документом является накладная, которую называют паспортом груза. Клиентам транспортно–логистических компаний при отправке документов или грузов приходится заполнять накладную. Корректно оформленный документ имеет определяющее значение для надежной и своевременной доставки отправления в пункт назначения. Накладная является главным документом груза или корреспонденции, который помогает таможенным органам понять содержимое отправления и поскорее пропустить его для дальнейшей доставки без задержек.",
            target: document.getElementById("invoice-input"),
        },

        {
            title: "Поле клиента",
            description:
                "Поле клиента является важной составляющей каждой заявки, здесь вы можете указать существующего клиента. Эта информация в дальнейшем будет учитываться в отчётах о выполненных заявках. Если вы не нашли нужного клиента, вы можете создать нового или выбрать из списка (не выбран).",
            target: document.getElementById("client-input"),
        },

        {
            title: "Поле автомобиля",
            description:
                "Тут тоже самое что и сполем клиента, эта информация так же будет учитываться в дальнейшем в отчётах.",
            target: document.getElementById("car-input"),
        },

        {
            title: "Панель управления созданием заявок",
            description:
                "Эта панель отвечает за рецепт, объём и смеситель, на котором будет исполняться заявка. Здесь вы можете любой доступный рецепт, но прежде вам необходимо выбрать категорию рецепта.",
            target: document.getElementById("recipes-card"),
        },

        {
            title: "Учитывать материал в бункерах",
            description:
                "Если вы поставите галочку здесь, у вас будут отображаться только те рецепты, в которых будет учтён материал в бункерах.",
            target: document.getElementById("is-include-in-bunkers"),
        },

        {
            title: "Быстрая заявка",
            description:
                "Если вы поставите галочку здесь, то все замесы кроме последнего будут дозироваться в грубом режиме, а последний замес продозируется с учетом того что недосыпалось или пересыпалось в прошлых, в общем скорректирует все показатели.",
            target: document.getElementById("is-quick-application"),
        },

        {
            title: "Категории рецепта",
            description:
                "Тут вы можете выбрать категорию рецептов, по которым будут отсортированы показанные вам рецепты, это сделано для вашего удобства, что бы не приходилось долго искать. Ведь время деньги!",
            target: document.getElementById("category-select"),
        },

        {
            title: "Рецепт",
            description:
                "Это поле для поиска рецептов. Всё что потерялось так же быстро найдётся! Здесь вы можете ввести название рецепта или часть от названия, а схожие рецепты попадут в таблицу ниже, из которых вы уже выберете рецепт для вашей заявки.",
            target: document.getElementById("recipe-search"),
        },

        {
            title: "Смеситель",
            description:
                "Здесь вам нужно будет выбрать смеситель, на котором будет исполняться заявка.",
            cover: <Image preview={false} src="/mixer.png" width={128} />,
            target: document.getElementById("mixer-select"),
            placement: "right",
        },

        {
            title: "Объём заявки",
            description:
                "Ну тут всё просто, здесь вы выбираете объём исполняемой заявки.",
            target: document.getElementById("volume-select"),
            placement: "right",
        },

        {
            title: "Создание заявки",
            description:
                "Наконец-то перейдём уже к созданию заявки. После того как вы заполните все поля из предыдущих уроков, мы можете нажать на эту кнопку, и заявка будет перемещена в предварительную очередь заявок",
            target: document.getElementById("create-application-button"),
        },
    ];

    return <Tour open={isOpen} onClose={onClose} steps={steps} />;
};
