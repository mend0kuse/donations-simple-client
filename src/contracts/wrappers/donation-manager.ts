import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary,
    Sender,
    SendMode,
    serializeTuple,
    TupleBuilder,
} from '@ton/core';

export type DonationManagerConfig = {
    owner: Address;
    admins?: Dictionary<bigint, Address>;
    item_code: Cell;
};

export function donationManagerConfigToCell({
    owner,
    admins,
    item_code,
}: DonationManagerConfig): Cell {
    return beginCell()
        .storeAddress(owner)
        .storeUint(1n, 64)
        .storeRef(item_code)
        .storeDict(admins)
        .endCell();
}

export class DonationManager implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DonationManager(address);
    }

    static createFromConfig(config: DonationManagerConfig, code: Cell, workchain = 0) {
        const data = donationManagerConfigToCell(config);
        const init = { code, data };
        return new DonationManager(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    buildEnableBody(index: number) {
        return beginCell()
            .storeUint(0x10, 32)
            .storeUint(1n, 64)
            .storeUint(BigInt(index), 64)
            .endCell();
    }

    buildDisableBody(index: number) {
        return beginCell()
            .storeUint(0x6, 32)
            .storeUint(1n, 64)
            .storeUint(BigInt(index), 64)
            .endCell();
    }

    async sendAddAdmins(provider: ContractProvider, via: Sender, value: bigint, admins: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x7, 32).storeUint(1n, 64).storeRef(admins).endCell(),
        });
    }

    async sendRemoveAdmins(provider: ContractProvider, via: Sender, value: bigint, admins: Cell) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x9, 32).storeUint(1n, 64).storeRef(admins).endCell(),
        });
    }

    async getData(provider: ContractProvider) {
        const result = (await provider.get('get_contract_data', [])).stack;

        return {
            owner: result.readAddress(),
            index: result.readBigNumber(),
            admins: (() => {
                try {
                    return result
                        .readCell()
                        .beginParse()
                        .loadDictDirect(Dictionary.Keys.Address(), Dictionary.Values.Address());
                } catch (error) {
                    return Dictionary.empty(Dictionary.Keys.Address(), Dictionary.Values.Address());
                }
            })(),
        };
    }

    async getManagerRights(provider: ContractProvider, target: Address) {
        const result = (
            await provider.get('get_manage_rights', [
                { type: 'slice', cell: beginCell().storeAddress(target).endCell() },
            ])
        ).stack;

        return [!!result.readBigNumber(), !!result.readBigNumber()];
    }

    async getDonationByIndex(provider: ContractProvider, index: bigint) {
        const result = (
            await provider.get('get_donation_address_by_index', [{ type: 'int', value: index }])
        ).stack;

        return result.readAddress();
    }

    buildRemoveAdminsBody(admins: Address[]) {
        const builder = new TupleBuilder();
        admins.forEach((admin) => builder.writeAddress(admin));

        return beginCell()
            .storeUint(0x9, 32)
            .storeUint(1n, 64)
            .storeRef(serializeTuple(builder.build()))
            .endCell();
    }

    buildAddAdminsBody(admins: Address[]) {
        const builder = new TupleBuilder();
        admins.forEach((admin) => builder.writeAddress(admin));

        return beginCell()
            .storeUint(0x7, 32)
            .storeUint(1n, 64)
            .storeRef(serializeTuple(builder.build()))
            .endCell();
    }

    buildCreateDonationBody({
        deadline,
        destination,
        hardcap,
    }: {
        hardcap: bigint;
        destination: Address;
        deadline: bigint;
    }) {
        return beginCell()
            .storeUint(0x100, 32)
            .storeUint(1n, 64)
            .storeCoins(hardcap)
            .storeAddress(destination)
            .storeUint(deadline, 32)
            .endCell();
    }

    async sendCreateDonation(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        createData: { hardcap: bigint; destination: Address; deadline: bigint },
    ) {
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: this.buildCreateDonationBody(createData),
        });
    }
}
