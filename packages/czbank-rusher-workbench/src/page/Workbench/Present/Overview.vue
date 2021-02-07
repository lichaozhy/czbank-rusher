<template>

<div>
	<h1>礼品总览</h1><hr>

	<ul class="list-unstyled">
		<li>已经被兑换过的礼品，将不能再被修改或者删除</li>
		<li>被设置为停用的礼品，将不能在被兑换</li>
	</ul>

	<b-button-toolbar>
		<b-button
			class="mr-auto"
			variant="primary"
			:disabled="!selectedPresent|| selectedPresent.usageCount > 0"
			@click="requestUpdating"
		>修改</b-button>

		<b-button
			class="mr-1"
			variant="success"
			@click="enableSelectedPresent"
			:disabled="!selectedPresent || selectedPresent.enabled"
		>启用</b-button>
		<b-button
			class="mr-auto"
			variant="warning"
			@click="disableSelectedPresent"
			:disabled="!selectedPresent || !selectedPresent.enabled"
		>停用</b-button>

		<b-button
			class="mr-0"
			variant="danger"
			@click="deleteSelectedPresent"
			:disabled="!selectedPresent || selectedPresent.usageCount > 0"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		id="present-table"
		class="mt-3"
		ref="present-table"
		:fields="presentTableFieldList"
		:items="presentItemList"
		small
		hover
		bordered
		selectable
		select-mode="single"
		@row-selected="selectPresent"
	>

		<template #cell(price)="{ item }">
			{{ item.price | numeralFloat }}￥
		</template>

		<template #cell(updatedAt)="{ item }">
			{{ item.updatedAt | localDatetime }}
		</template>

		<template #cell(createdAt)="{ item }">
			{{ item.createdAt | localDatetime }}
		</template>

		<template #cell(enabled)="{ item }">
			<b-form-checkbox
				:checked="item.enabled"
				switch
				disabled
			>?</b-form-checkbox>
		</template>

	</b-table>

	<b-modal
		centered
		title="更新礼品信息"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		ref="updating"
		@ok="updatePresent($event)"
	>
		<PresentUpdating
			:present-id="selectedPresentId"
			ref="present-updating-form"
		/>
	</b-modal>
</div>

</template>

<script>
import PresentUpdating from './Updating';

export default {
	components: {
		PresentUpdating: PresentUpdating
	},
	data() {
		return {
			presentList: [],
			selectedPresentId: null
		};
	},
	methods: {
		selectPresent(rows) {
			if (rows.length > 0) {
				this.selectedPresentId = rows[0].id;
			} else {
				this.selectedPresentId = null;
			}
		},
		async getPresentList() {
			this.$refs['present-table'].selectRow();
			this.presentList = await this.$rusher.backend.Present.query();
		},
		async enableSelectedPresent() {
			await this.ISelectedPresent().setEnabled(true);
			await this.getPresentList();
		},
		async disableSelectedPresent() {
			await this.ISelectedPresent().setEnabled(false);
			await this.getPresentList();
		},
		async deleteSelectedPresent() {
			await this.ISelectedPresent().delete(false);
			await this.getPresentList();
		},
		ISelectedPresent() {
			if (this.selectedPresentId !== null) {
				return this.$rusher.backend.Present(this.selectedPresentId);
			}

			return null;
		},
		requestUpdating() {
			this.$refs.updating.show();
		},
		async updatePresent(event) {
			try {
				await this.$refs['present-updating-form'].update();
				await this.getPresentList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		}
	},
	computed: {
		selectedPresent() {
			return this.presentList.find(present => present.id === this.selectedPresentId);
		},
		presentItemList() {
			return this.presentList.map(present => {
				return {
					id: present.id,
					name: present.name,
					price: present.price,
					point: present.point,
					usageCount: present.usageCount,
					enabled: present.enabled,
					description: present.description,
					updatedAt: present.updatedAt,
					createdAt: present.createdAt,
				};
			});
		},
		presentTableFieldList() {
			return [
				{ key: 'name', label: '名称', class: 'col-short-string' },
				{ key: 'price', label: '采购成本', sortable: true, class: 'col-number' },
				{ key: 'point', label: '积分单价', sortable: true, class: 'col-short-number' },
				{ key: 'usageCount', label: '已送出', sortable: true, class: 'col-short-number' },
				{ key: 'enabled', label: '可用？', sortable: true, class: 'col-enabled' },
				{ key: 'description', label: '描述' },
				{ key: 'updatedAt', label: '更新于', sortable: true, class: 'col-datetime' },
				{ key: 'createdAt', label: '创建于', sortable: true, class: 'col-datetime' },
				{ key: 'blank', label: '', class: 'col-blank' }
			];
		}
	},
	mounted() {
		this.getPresentList();
	}
};
</script>

<style lang="scss">
#present-table {
	.col-enabled {
		width: 5em;
		text-align: center;

		label {
			color: transparent;
		}
	}
}
</style>
